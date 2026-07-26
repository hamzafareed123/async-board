interface MemberAvatarsProps {
    members: {
        userId: string;
        fullName: string;
        profilePic?: string;
        cursorColor: string;
    }[];
}



const MAX_VISIBLE = 3;

const MemberAvatars = ({ members }: MemberAvatarsProps) => {
    const visible = members.slice(0, MAX_VISIBLE);
    const remaining = members.length - MAX_VISIBLE;

    return (
        <div className="flex items-center">
            {visible.map((member, index) => (
                <div
                    key={member.cursorColor}
                    className="relative group"
                    style={{ marginLeft: index === 0 ? 0 : "-8px", zIndex: index }}
                >
                    {/* Avatar */}
                    {member.profilePic ? (
                        <img
                            src={member.profilePic}
                            alt={member.fullName}
                            className="w-8 h-8 rounded-full object-cover cursor-pointer border-2 border-surface"
                            style={{ borderColor: member.cursorColor }}
                        />
                    ) : (
                        <div
                            className="w-8 h-8 rounded-full border-2 cursor-pointer border-surface
                                flex items-center justify-center text-white text-xs font-semibold"
                            style={{
                                background: member.cursorColor,
                                borderColor: member.cursorColor
                            }}
                        >
                            {member.fullName.charAt(0).toUpperCase()}
                        </div>
                    )}

                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2
                        px-2 py-1 bg-surface border border-border rounded text-xs
                        text-text-primary whitespace-nowrap opacity-0
                        group-hover:opacity-100 transition pointer-events-none z-50">
                        {member.fullName}
                    </div>
                </div>
            ))}

            {/* +N more */}
            {remaining > 0 && (
                <div
                    className="w-8 h-8 rounded-full bg-surface-2 border border-border
                        flex items-center justify-center text-xs font-medium
                        text-text-secondary cursor-pointer"
                    style={{ marginLeft: "-8px" }}
                >
                    +{remaining}
                </div>
            )}
        </div>
    );
};

export default MemberAvatars;