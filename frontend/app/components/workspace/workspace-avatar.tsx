export const WorkspaceAvatar = ({
    color,
    name
}:{
    color: string;
    name: string;
}) => {
    return <div className="flex items-center justify-center w-6 h-6 rounded" style={{backgroundColor: color}}>
        <span className="text-xs font-medium text-white">
            {name.charAt(0).toUpperCase()}
        </span>
    </div>;
};