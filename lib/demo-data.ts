// Demo data for Fay Goals app - used when Supabase is not configured
import type { User, Goal, Event, GroceryItem, Quote } from './types'

export const DEMO_USERS: User[] = [
  { id: '11111111-1111-1111-1111-111111111111', name: 'Nate', role: 'parent', avatar_url: null, created_at: '2026-01-01' },
  { id: '22222222-2222-2222-2222-222222222222', name: 'Dalton', role: 'child', avatar_url: null, created_at: '2026-01-01' },
  { id: '33333333-3333-3333-3333-333333333333', name: 'Mason', role: 'child', avatar_url: null, created_at: '2026-01-01' },
]

export const DEMO_GOALS: Goal[] = [
  // Nate's goals
  { id: 'g1', user_id: '11111111-1111-1111-1111-111111111111', title: 'Lose 7 lbs', description: 'Get back to fighting weight', target_value: 7, current_value: 2, unit: 'lbs', category: 'health', deadline: '2026-06-01', is_starred: false, is_completed: false, created_at: '2026-01-01', updated_at: '2026-01-01' },
  { id: 'g2', user_id: '11111111-1111-1111-1111-111111111111', title: 'Travel Out of Country', description: 'International trip with family', target_value: 1, current_value: 0, unit: 'trips', category: 'travel', deadline: '2026-12-31', is_starred: true, is_completed: false, created_at: '2026-01-01', updated_at: '2026-01-01' },
  { id: 'g3', user_id: '11111111-1111-1111-1111-111111111111', title: 'Golf Simulator Done', description: 'Complete home golf simulator setup', target_value: 4, current_value: 2, unit: 'milestones', category: 'personal', deadline: '2026-03-31', is_starred: false, is_completed: false, created_at: '2026-01-01', updated_at: '2026-01-01' },
  { id: 'g4', user_id: '11111111-1111-1111-1111-111111111111', title: 'Launch Side Project', description: 'Ship the side project', target_value: 8, current_value: 5, unit: 'milestones', category: 'professional', deadline: '2026-05-01', is_starred: false, is_completed: false, created_at: '2026-01-01', updated_at: '2026-01-01' },
  { id: 'g5', user_id: '11111111-1111-1111-1111-111111111111', title: 'Reduce Phone Time', description: 'Less screen time', target_value: 2, current_value: 4.5, unit: 'hrs/day', category: 'health', deadline: '2026-12-31', is_starred: false, is_completed: false, created_at: '2026-01-01', updated_at: '2026-01-01' },
  { id: 'g6', user_id: '11111111-1111-1111-1111-111111111111', title: 'Workout 5x/Week', description: 'Consistent exercise routine', target_value: 5, current_value: 3, unit: 'days', category: 'health', deadline: '2026-12-31', is_starred: false, is_completed: false, created_at: '2026-01-01', updated_at: '2026-01-01' },

  // Dalton's goals
  { id: 'g7', user_id: '22222222-2222-2222-2222-222222222222', title: 'Hit 93 MPH', description: 'Pitching velocity goal', target_value: 93, current_value: 88, unit: 'mph', category: 'sports', deadline: '2026-12-31', is_starred: true, is_completed: false, created_at: '2026-01-01', updated_at: '2026-01-01' },
  { id: 'g8', user_id: '22222222-2222-2222-2222-222222222222', title: "Straight A's Jr Year", description: 'Academic excellence', target_value: 4.0, current_value: 3.7, unit: 'gpa', category: 'academic', deadline: '2026-06-01', is_starred: false, is_completed: false, created_at: '2026-01-01', updated_at: '2026-01-01' },
  { id: 'g9', user_id: '22222222-2222-2222-2222-222222222222', title: 'Make Varsity Baseball', description: 'Team roster goal', target_value: 1, current_value: 0, unit: 'roster', category: 'sports', deadline: '2026-03-01', is_starred: true, is_completed: false, created_at: '2026-01-01', updated_at: '2026-01-01' },
  { id: 'g10', user_id: '22222222-2222-2222-2222-222222222222', title: 'Leadership Role', description: 'Take on team leadership', target_value: 4, current_value: 2, unit: 'milestones', category: 'personal', deadline: '2026-09-01', is_starred: false, is_completed: false, created_at: '2026-01-01', updated_at: '2026-01-01' },
  { id: 'g11', user_id: '22222222-2222-2222-2222-222222222222', title: 'College Visits', description: 'Visit prospective colleges', target_value: 6, current_value: 1, unit: 'visits', category: 'academic', deadline: '2026-11-30', is_starred: false, is_completed: false, created_at: '2026-01-01', updated_at: '2026-01-01' },
  { id: 'g12', user_id: '22222222-2222-2222-2222-222222222222', title: 'Build Highlights Reel', description: 'Create recruiting video', target_value: 3, current_value: 0, unit: 'milestones', category: 'sports', deadline: '2026-07-31', is_starred: false, is_completed: false, created_at: '2026-01-01', updated_at: '2026-01-01' },

  // Mason's goals
  { id: 'g13', user_id: '33333333-3333-3333-3333-333333333333', title: 'Mid/High 70s Velo', description: 'Pitching velocity target', target_value: 77, current_value: 72, unit: 'mph', category: 'sports', deadline: '2026-12-31', is_starred: true, is_completed: false, created_at: '2026-01-01', updated_at: '2026-01-01' },
  { id: 'g14', user_id: '33333333-3333-3333-3333-333333333333', title: 'Be More Confident', description: 'Personal growth', target_value: 8, current_value: 3, unit: 'milestones', category: 'personal', deadline: '2026-12-31', is_starred: false, is_completed: false, created_at: '2026-01-01', updated_at: '2026-01-01' },
  { id: 'g15', user_id: '33333333-3333-3333-3333-333333333333', title: 'Sub 5:40 Mile', description: 'Running time goal', target_value: 340, current_value: 365, unit: 'seconds', category: 'sports', deadline: '2026-05-01', is_starred: true, is_completed: false, created_at: '2026-01-01', updated_at: '2026-01-01' },
  { id: 'g16', user_id: '33333333-3333-3333-3333-333333333333', title: 'Read 12 Books', description: 'Reading challenge', target_value: 12, current_value: 4, unit: 'books', category: 'personal', deadline: '2026-12-31', is_starred: false, is_completed: false, created_at: '2026-01-01', updated_at: '2026-01-01' },
  { id: 'g17', user_id: '33333333-3333-3333-3333-333333333333', title: 'Join School Club', description: 'Extracurricular involvement', target_value: 3, current_value: 2, unit: 'milestones', category: 'personal', deadline: '2026-02-28', is_starred: false, is_completed: false, created_at: '2026-01-01', updated_at: '2026-01-01' },
  { id: 'g18', user_id: '33333333-3333-3333-3333-333333333333', title: 'Improve Grades', description: 'Academic improvement', target_value: 3.5, current_value: 3.2, unit: 'gpa', category: 'academic', deadline: '2026-06-01', is_starred: false, is_completed: false, created_at: '2026-01-01', updated_at: '2026-01-01' },
]

export const DEMO_EVENTS: Event[] = [
  { id: 'e1', title: 'Work', description: 'Remote work day', start_time: '2026-01-27T08:00:00-07:00', end_time: '2026-01-27T17:00:00-07:00', is_all_day: false, recurrence_rule: 'FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR', location: null, color: '#3B82F6', created_at: '2026-01-01' },
  { id: 'e2', title: 'Practice', description: 'Baseball practice', start_time: '2026-01-27T16:00:00-07:00', end_time: '2026-01-27T18:00:00-07:00', is_all_day: false, recurrence_rule: 'FREQ=WEEKLY;BYDAY=MO,WE,SA', location: null, color: '#22C55E', created_at: '2026-01-01' },
  { id: 'e3', title: 'Game', description: 'Baseball game', start_time: '2026-01-28T17:00:00-07:00', end_time: '2026-01-28T20:00:00-07:00', is_all_day: false, recurrence_rule: 'FREQ=WEEKLY;BYDAY=TU,TH,FR', location: null, color: '#EAB308', created_at: '2026-01-01' },
  { id: 'e4', title: 'Hawaii Trip', description: 'Family vacation to Hawaii', start_time: '2026-01-28T00:00:00-07:00', end_time: '2026-01-31T23:59:59-07:00', is_all_day: true, recurrence_rule: null, location: 'Honolulu, Hawaii', color: '#EC4899', created_at: '2026-01-01' },
]

export const DEMO_GROCERY: GroceryItem[] = [
  { id: 'gr1', name: 'Eggs', quantity: 12, is_checked: false, added_by: '11111111-1111-1111-1111-111111111111', created_at: '2026-01-20' },
  { id: 'gr2', name: 'Milk', quantity: 1, is_checked: false, added_by: '11111111-1111-1111-1111-111111111111', created_at: '2026-01-20' },
  { id: 'gr3', name: 'Chicken Breast', quantity: 3, is_checked: false, added_by: '11111111-1111-1111-1111-111111111111', created_at: '2026-01-20' },
  { id: 'gr4', name: 'Bread', quantity: 1, is_checked: true, added_by: '11111111-1111-1111-1111-111111111111', created_at: '2026-01-19' },
  { id: 'gr5', name: 'Bananas', quantity: 1, is_checked: false, added_by: '33333333-3333-3333-3333-333333333333', created_at: '2026-01-20' },
  { id: 'gr6', name: 'Protein Powder', quantity: 1, is_checked: false, added_by: '22222222-2222-2222-2222-222222222222', created_at: '2026-01-20' },
  { id: 'gr7', name: 'Orange Juice', quantity: 1, is_checked: false, added_by: '11111111-1111-1111-1111-111111111111', created_at: '2026-01-20' },
  { id: 'gr8', name: 'Sunscreen', quantity: 1, is_checked: false, added_by: '11111111-1111-1111-1111-111111111111', created_at: '2026-01-20' },
]

export const DEMO_QUOTES: Quote[] = [
  { id: 'q1', text: 'The only way to do great work is to love what you do.', author: 'Steve Jobs', is_active: true },
  { id: 'q2', text: "Hard work beats talent when talent doesn't work hard.", author: 'Tim Notke', is_active: true },
  { id: 'q3', text: 'Success is not final, failure is not fatal: it is the courage to continue that counts.', author: 'Winston Churchill', is_active: true },
  { id: 'q4', text: "The difference between the impossible and the possible lies in a person's determination.", author: 'Tommy Lasorda', is_active: true },
  { id: 'q5', text: "I've missed more than 9000 shots in my career. I've lost almost 300 games. 26 times, I've been trusted to take the game winning shot and missed. I've failed over and over and over again in my life. And that is why I succeed.", author: 'Michael Jordan', is_active: true },
  { id: 'q6', text: "It's not whether you get knocked down, it's whether you get up.", author: 'Vince Lombardi', is_active: true },
  { id: 'q7', text: 'The only person you are destined to become is the person you decide to be.', author: 'Ralph Waldo Emerson', is_active: true },
  { id: 'q8', text: 'Champions keep playing until they get it right.', author: 'Billie Jean King', is_active: true },
  { id: 'q9', text: "You miss 100% of the shots you don't take.", author: 'Wayne Gretzky', is_active: true },
  { id: 'q10', text: 'Great things come from hard work & perseverance. No excuses.', author: 'Kobe Bryant', is_active: true },
]

// Helper function to get user by ID
export function getDemoUser(id: string): User | undefined {
  return DEMO_USERS.find(u => u.id === id)
}

// Helper function to get user by name
export function getDemoUserByName(name: string): User | undefined {
  return DEMO_USERS.find(u => u.name.toLowerCase() === name.toLowerCase())
}

// Helper function to get goals by user ID
export function getDemoGoalsByUser(userId: string): Goal[] {
  return DEMO_GOALS.filter(g => g.user_id === userId)
}

// Helper function to calculate goal progress
export function calculateGoalProgress(goal: Goal): number {
  if (!goal.target_value) return 0
  // For goals where lower is better (like phone time, mile time)
  if (goal.unit === 'seconds' || goal.title.toLowerCase().includes('reduce')) {
    return Math.min(100, Math.round(((goal.target_value - (goal.current_value - goal.target_value)) / goal.target_value) * 100))
  }
  return Math.min(100, Math.round((goal.current_value / goal.target_value) * 100))
}

// Helper function to determine goal status
export function getGoalStatus(goal: Goal): 'on-track' | 'behind' | 'ahead' | 'completed' | 'not-started' {
  if (goal.is_completed) return 'completed'
  if (goal.current_value === 0) return 'not-started'

  const progress = calculateGoalProgress(goal)

  // Calculate expected progress based on deadline
  if (goal.deadline) {
    const now = new Date()
    const deadline = new Date(goal.deadline)
    const start = new Date(goal.created_at)
    const totalDuration = deadline.getTime() - start.getTime()
    const elapsed = now.getTime() - start.getTime()
    const expectedProgress = Math.min(100, (elapsed / totalDuration) * 100)

    if (progress >= expectedProgress + 10) return 'ahead'
    if (progress < expectedProgress - 10) return 'behind'
  }

  return 'on-track'
}

// Helper to get random quote
export function getRandomDemoQuote(): Quote {
  return DEMO_QUOTES[Math.floor(Math.random() * DEMO_QUOTES.length)]
}

// Helper to calculate Hawaii countdown
export function getHawaiiCountdown(): number {
  const hawaiiDate = new Date('2026-01-28')
  const today = new Date()
  const diffTime = hawaiiDate.getTime() - today.getTime()
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}
