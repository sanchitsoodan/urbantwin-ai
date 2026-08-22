import { UserProfile, SignUpFormData, LoginFormData } from '../types/auth';

const STORAGE_USERS_KEY = 'urbantwin_database_users_v3';
const STORAGE_CURRENT_USER_KEY = 'urbantwin_current_session_v3';

const AVATAR_COLORS = [
  'bg-blue-600',
  'bg-indigo-600',
  'bg-emerald-600',
  'bg-purple-600',
  'bg-rose-600',
  'bg-amber-600',
  'bg-teal-600'
];

// The ONLY pre-registered super admin account
const INITIAL_SUPER_ADMIN: UserProfile = {
  id: 'usr_sanchit_superadmin',
  fullName: 'Sanchit Soodan',
  email: 'sanchitsoodan2405@gmail.com',
  password: '@123',
  role: 'Super Admin (System Owner)',
  cityAffiliation: 'Chandigarh',
  avatarColor: 'bg-indigo-600',
  createdAt: '2026-08-23T00:00:00.000Z',
  lastLogin: new Date().toISOString(),
  actionsCount: 1,
  isAdmin: true,
  isSuperAdmin: true
};

export function getDatabaseUsers(): UserProfile[] {
  try {
    const raw = localStorage.getItem(STORAGE_USERS_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify([INITIAL_SUPER_ADMIN]));
      return [INITIAL_SUPER_ADMIN];
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify([INITIAL_SUPER_ADMIN]));
      return [INITIAL_SUPER_ADMIN];
    }
    // Ensure the primary admin exists and has the correct password
    const adminExists = parsed.some(u => u.email.toLowerCase() === 'sanchitsoodan2405@gmail.com');
    if (!adminExists) {
      const updated = [INITIAL_SUPER_ADMIN, ...parsed];
      localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(updated));
      return updated;
    }
    return parsed;
  } catch {
    return [INITIAL_SUPER_ADMIN];
  }
}

export function saveDatabaseUsers(users: UserProfile[]): void {
  try {
    localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
  } catch (e) {
    console.error('Failed to save users to database:', e);
  }
}

export function getCurrentSessionUser(): UserProfile | null {
  try {
    const raw = localStorage.getItem(STORAGE_CURRENT_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setCurrentSessionUser(user: UserProfile | null): void {
  try {
    if (user) {
      // Don't store password in session state
      const { password, ...safeUser } = user;
      localStorage.setItem(STORAGE_CURRENT_USER_KEY, JSON.stringify(safeUser));
    } else {
      localStorage.removeItem(STORAGE_CURRENT_USER_KEY);
    }
  } catch (e) {
    console.error('Failed to update session:', e);
  }
}

export async function signUpUser(data: SignUpFormData): Promise<UserProfile> {
  const users = getDatabaseUsers();
  const normalizedEmail = data.email.trim().toLowerCase();

  // Check if email already exists
  const existing = users.find(u => u.email.toLowerCase() === normalizedEmail);
  if (existing) {
    throw new Error(`An account with email "${data.email}" is already registered. Please log in.`);
  }

  const isPrimaryAdminEmail = normalizedEmail === 'sanchitsoodan2405@gmail.com';
  const randomColor = AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];

  const newUser: UserProfile = {
    id: `usr_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`,
    fullName: data.fullName.trim(),
    email: normalizedEmail,
    password: data.password,
    role: isPrimaryAdminEmail ? 'Super Admin (System Owner)' : data.role,
    cityAffiliation: data.cityAffiliation,
    avatarColor: randomColor,
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
    actionsCount: 1,
    isAdmin: isPrimaryAdminEmail,
    isSuperAdmin: isPrimaryAdminEmail
  };

  const updatedList = [...users, newUser];
  saveDatabaseUsers(updatedList);
  setCurrentSessionUser(newUser);

  return newUser;
}

export async function loginUser(data: LoginFormData): Promise<UserProfile> {
  const users = getDatabaseUsers();
  const normalizedEmail = data.email.trim().toLowerCase();
  
  const found = users.find(u => u.email.toLowerCase() === normalizedEmail);
  if (!found) {
    throw new Error(`No registered account found for "${data.email}". Please sign up first.`);
  }

  // Password verification
  if (found.password && found.password !== data.password) {
    throw new Error('Incorrect password. Please enter the correct password.');
  }

  const updatedUser: UserProfile = {
    ...found,
    lastLogin: new Date().toISOString(),
    actionsCount: (found.actionsCount || 0) + 1
  };

  const updatedList = users.map(u => u.id === found.id ? updatedUser : u);
  saveDatabaseUsers(updatedList);
  setCurrentSessionUser(updatedUser);

  return updatedUser;
}

export function toggleUserAdminStatus(userId: string): UserProfile[] {
  const users = getDatabaseUsers();
  const target = users.find(u => u.id === userId);
  if (!target) return users;

  // Cannot demote super admin
  if (target.isSuperAdmin || target.email === 'sanchitsoodan2405@gmail.com') {
    return users;
  }

  const updatedUser: UserProfile = {
    ...target,
    isAdmin: !target.isAdmin
  };

  const updatedList = users.map(u => u.id === userId ? updatedUser : u);
  saveDatabaseUsers(updatedList);

  const current = getCurrentSessionUser();
  if (current && current.id === userId) {
    setCurrentSessionUser(updatedUser);
  }

  return updatedList;
}

export function deleteDatabaseUser(userId: string): UserProfile[] {
  const users = getDatabaseUsers();
  const target = users.find(u => u.id === userId);
  
  // Guard against deleting the system super admin
  if (target?.isSuperAdmin || target?.email === 'sanchitsoodan2405@gmail.com') {
    throw new Error('Cannot delete the primary Super Admin account.');
  }

  const filtered = users.filter(u => u.id !== userId);
  saveDatabaseUsers(filtered);
  
  const current = getCurrentSessionUser();
  if (current && current.id === userId) {
    setCurrentSessionUser(null);
  }
  return filtered;
}

export function exportDatabaseJson(): string {
  const users = getDatabaseUsers();
  // Strip passwords for export safety
  const safeUsers = users.map(({ password, ...rest }) => rest);
  return JSON.stringify(safeUsers, null, 2);
}
