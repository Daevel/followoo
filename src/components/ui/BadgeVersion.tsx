export function BadgeVersion({ version, backgroundColor }: { version: string; backgroundColor?: string }) {
    return(
        <div className={`inline-flex h-7 px-5 py-2 w-20 rounded-[20px] items-center align-middle justify-center p1-b ${backgroundColor ? `bg-${backgroundColor}` : 'bg-bg'}`}>
            <span className="font-bold">v{version}</span>
        </div>
    )
}