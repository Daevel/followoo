interface NavBarProps {
  children: React.ReactNode;
  onClick: () => void;
  isFallbackIconVisible?: boolean;
  isHelpIconVisible?: boolean;
  disabled?: boolean;
}

export function NavBar({ isFallbackIconVisible = true, isHelpIconVisible = false , children, onClick, disabled }: NavBarProps) {
    return (
        /* TODO - Strutturare NavBar */
        <p className="text-primary">Navbar works</p>
    )
}