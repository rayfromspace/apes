import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { z } from "zod";

const resetPasswordSchema = z.object({
  token: z.string(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100)
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { token, password } = resetPasswordSchema.parse(body);

    // TODO: Validate reset token
    // TODO: Get user from database using token
    // TODO: Update user's password in database
    const hashedPassword = await hash(password, 10);

    // For now, just return success
    return NextResponse.json({
      message: "Password reset successfully",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to reset password" },
      { status: 500 }
    );
  }
}
