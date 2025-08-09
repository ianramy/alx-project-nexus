// src/components/users/UserAvatar.tsx

export const UserAvatar = ({ 
    username 
}: { 
        username: string 
}) => (
		<div 
		className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center">
        {username[0]}
        </div>
);
