import { createClient } from '@/lib/supabase/client'
import { Database } from '@/lib/types/database'
import { ProjectPreview, ProjectWithAccess } from '@/lib/types/project'

// Create a Supabase client for use in the browser
const supabase = createClient()

/**
 * Fetch public preview data for a single project
 */
export async function getProjectPreview(slug: string): Promise<ProjectPreview | null> {
  const { data, error } = await supabase
    .from('projects')
    .select(`
      id,
      title,
      description,
      slug,
      status,
      cover_image,
      team_size,
      stage,
      industry,
      funding_goal,
      current_funding,
      completed_milestones,
      total_milestones,
      team_growth,
      project_health,
      has_investment_opportunities,
      has_open_roles,
      minimum_investment,
      tags,
      social_links,
      visibility
    `)
    .eq('slug', slug)
    .eq('visibility', 'public')
    .single()

  if (error) {
    console.error('Error fetching project preview:', error)
    return null
  }

  return data as ProjectPreview
}

/**
 * Fetch public preview data for multiple projects
 */
export async function getPublicProjects(
  page: number = 1,
  limit: number = 10,
  filters?: {
    industry?: string
    stage?: string
    hasInvestmentOpportunities?: boolean
    hasOpenRoles?: boolean
  }
): Promise<{ projects: ProjectPreview[]; total: number }> {
  let query = supabase
    .from('projects')
    .select('*', { count: 'exact' })
    .eq('visibility', 'public')
    .range((page - 1) * limit, page * limit - 1)

  // Apply filters if provided
  if (filters) {
    if (filters.industry) {
      query = query.eq('industry', filters.industry)
    }
    if (filters.stage) {
      query = query.eq('stage', filters.stage)
    }
    if (filters.hasInvestmentOpportunities !== undefined) {
      query = query.eq('has_investment_opportunities', filters.hasInvestmentOpportunities)
    }
    if (filters.hasOpenRoles !== undefined) {
      query = query.eq('has_open_roles', filters.hasOpenRoles)
    }
  }

  const { data, error, count } = await query

  if (error) {
    console.error('Error fetching public projects:', error)
    return { projects: [], total: 0 }
  }

  return {
    projects: (data || []) as ProjectPreview[],
    total: count || 0,
  }
}

/**
 * Search public projects
 */
export async function searchPublicProjects(
  searchTerm: string,
  limit: number = 10
): Promise<ProjectPreview[]> {
  const { data, error } = await supabase
    .from('projects')
    .select(`
      id,
      title,
      description,
      slug,
      industry,
      stage,
      tags
    `)
    .eq('visibility', 'public')
    .textSearch('title', searchTerm, {
      type: 'websearch',
      config: 'english'
    })
    .limit(limit)

  if (error) {
    console.error('Error searching projects:', error)
    return []
  }

  return data as ProjectPreview[]
}

/**
 * Get featured projects
 */
export async function getFeaturedProjects(limit: number = 6): Promise<ProjectPreview[]> {
  const { data, error } = await supabase
    .from('projects')
    .select(`
      id,
      title,
      description,
      slug,
      cover_image,
      industry,
      stage,
      funding_goal,
      current_funding,
      has_investment_opportunities,
      has_open_roles
    `)
    .eq('visibility', 'public')
    .order('project_health', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching featured projects:', error)
    return []
  }

  return data as ProjectPreview[]
}

/**
 * Get project stats
 */
export async function getProjectStats(): Promise<{
  totalProjects: number
  totalFunding: number
  totalOpenRoles: number
}> {
  const { data, error } = await supabase
    .from('projects')
    .select(`
      id,
      current_funding,
      has_open_roles
    `)
    .eq('visibility', 'public')

  if (error) {
    console.error('Error fetching project stats:', error)
    return {
      totalProjects: 0,
      totalFunding: 0,
      totalOpenRoles: 0,
    }
  }

  const totalFunding = data.reduce((sum, project) => sum + (project.current_funding || 0), 0)
  const totalOpenRoles = data.filter(project => project.has_open_roles).length

  return {
    totalProjects: data.length,
    totalFunding,
    totalOpenRoles,
  }
}
