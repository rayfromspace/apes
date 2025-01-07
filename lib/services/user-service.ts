import { supabase } from '@/lib/supabase/client';
import crypto from 'crypto';
import { hash, compare } from 'bcryptjs';

export class UserService {
  static async createUser(data: {
    email: string;
    password: string;
    full_name: string;
    role: 'investor' | 'founder' | 'both';
  }) {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          full_name: data.full_name,
          role: data.role,
        },
      },
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error('Failed to create user');

    // Create user profile
    const { error: profileError } = await supabase
      .from('users')
      .insert([
        {
          id: authData.user.id,
          email: data.email,
          full_name: data.full_name,
          role: data.role,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ]);

    if (profileError) throw profileError;
    return authData.user;
  }

  static async findUserByEmail(email: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error) throw error;
    return data;
  }

  static async findUserById(id: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  static async updateUser(id: string, data: {
    full_name?: string;
    avatar_url?: string;
    bio?: string;
    company?: string;
    position?: string;
    location?: string;
    skills?: string[];
    interests?: string[];
  }) {
    const { data: userData, error } = await supabase
      .from('users')
      .update({
        ...data,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return userData;
  }

  static async updateUserProfile(id: string, data: {
    bio?: string;
    company?: string;
    position?: string;
    location?: string;
    skills?: string[];
    interests?: string[];
    avatar_url?: string;
  }) {
    const { error } = await supabase
      .from('user_profiles')
      .upsert(
        {
          user_id: id,
          ...data,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id' }
      );

    if (error) throw error;
  }

  static async uploadAvatar(userId: string, file: File) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/avatar.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(fileName, file, { upsert: true });

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(fileName);

    await this.updateUser(userId, { avatar_url: publicUrl });
    return publicUrl;
  }

  static async getUserProfile(userId: string) {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return data;
  }

  static async searchUsers(query: string) {
    const { data, error } = await supabase
      .from('users')
      .select('id, full_name, email, avatar_url, role')
      .or(`full_name.ilike.%${query}%,email.ilike.%${query}%`)
      .limit(10);

    if (error) throw error;
    return data;
  }

  static async verifyPassword(userId: string, password: string) {
    const { data, error } = await supabase
      .from('auth.users')
      .select('password')
      .eq('id', userId)
      .single();

    if (error) throw error;
    if (!data) return false;
    return compare(password, data.password);
  }

  static async updatePassword(userId: string, newPassword: string) {
    const hashedPassword = await hash(newPassword, 10);
    const { error } = await supabase.auth.updateUser(userId, { password: hashedPassword });

    if (error) throw error;
  }

  static async createPasswordResetToken(email: string) {
    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 3600000); // 1 hour from now

    const { error } = await supabase
      .from('users')
      .update({
        reset_token: token,
        reset_token_expires: expires.toISOString(),
      })
      .eq('email', email);

    if (error) throw error;
    return { token, expires };
  }

  static async verifyResetToken(token: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('reset_token', token)
      .single();

    if (error) throw error;
    if (!data) return null;
    if (new Date(data.reset_token_expires) < new Date()) return null;

    return data;
  }

  static async resetPassword(token: string, newPassword: string) {
    const user = await this.verifyResetToken(token);
    if (!user) throw new Error('Invalid or expired reset token');

    const hashedPassword = await hash(newPassword, 10);
    const { error } = await supabase.auth.updateUser(user.id, { password: hashedPassword });

    if (error) throw error;

    await supabase
      .from('users')
      .update({
        reset_token: null,
        reset_token_expires: null,
      })
      .eq('id', user.id);
  }

  static async createSession(userId: string) {
    const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
    
    const { data, error } = await supabase
      .from('sessions')
      .insert([
        {
          user_id: userId,
          expires: expires.toISOString(),
        },
      ]);

    if (error) throw error;
    return data[0];
  }

  static async getSession(sessionId: string) {
    const { data, error } = await supabase
      .from('sessions')
      .select('*')
      .eq('id', sessionId)
      .single();

    if (error) throw error;
    return data;
  }

  static async deleteSession(sessionId: string) {
    const { error } = await supabase
      .from('sessions')
      .delete()
      .eq('id', sessionId);

    if (error) throw error;
  }

  static async deleteExpiredSessions() {
    const { error } = await supabase
      .from('sessions')
      .delete()
      .lt('expires', new Date().toISOString());

    if (error) throw error;
  }
}
