# Google OAuth Default Role Explanation

## Current Implementation

When a user logs in with Google OAuth for the first time, they are automatically assigned the role **"expediteur"** (Shipper).

## Why "expediteur" (Shipper) as Default?

1. **Most Common Use Case**: In a transport/logistics platform, most users are typically shippers who need to send packages, not drivers who transport them.

2. **Lower Barrier to Entry**: Shippers can start using the platform immediately without needing to provide vehicle information, which is required for drivers.

3. **Safety**: It's safer to default to a less privileged role. Users who need driver privileges can:
   - Contact an admin to change their role
   - Update their profile later (if you implement role selection)

4. **Flexibility**: The role can be changed later by:
   - An admin user through the admin panel
   - The user themselves (if you add role selection in profile settings)

## Alternative Approaches

If you want to allow users to choose their role during Google OAuth:

### Option 1: Role Selection After OAuth
After Google authentication, redirect to a role selection page before creating the account.

### Option 2: Role Selection During Registration
Only allow Google OAuth for existing users, require new users to register with role selection.

### Option 3: Profile Completion Flow
After Google OAuth, show a profile completion form where users can select their role and add required information (phone, vehicle info for drivers, etc.).

## Current Behavior

- **New Google users**: Automatically assigned "expediteur" role
- **Existing users with email**: Google account is linked, role remains unchanged
- **Role can be changed**: By admin or through profile settings (if implemented)

## Recommendation

The current approach (defaulting to "expediteur") is a good practice because:
- It's the most common use case
- It allows immediate platform access
- It maintains security (less privileged by default)
- It can be changed later if needed

If you want to implement role selection, consider adding it as a post-OAuth step or in the profile settings.

