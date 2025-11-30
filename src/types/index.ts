export interface User {
  id: string
  email: string
  username: string
  displayName?: string
  avatarUrl?: string
  isPlatformAdmin: boolean
  isEmailVerified: boolean
}

export interface Tenant {
  id: string
  clanTag: string
  clanName: string
  clanBadgeUrl?: string
  clanLevel: number
  memberCount: number
  description?: string
  isActive: boolean
}

export interface Player {
  id: string
  playerTag: string
  playerName: string
  townHallLevel: number
  expLevel: number
  trophies: number
  clanTag?: string
  clanName?: string
  isVerified: boolean
}

export enum Role {
  MEMBER = 'MEMBER',
  ELDER = 'ELDER',
  CO_LEADER = 'CO_LEADER',
  LEADER = 'LEADER',
  SUPER_ADMIN = 'SUPER_ADMIN',
}

export interface AuthResponse {
  access_token: string
  user: User
}