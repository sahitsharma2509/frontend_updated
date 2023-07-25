// ClientSideComponent.tsx
import React, { useState, useEffect, FC } from 'react';

interface ClientSideComponentProps {
	children: React.ReactNode;
}

const ClientSideComponent: FC<ClientSideComponentProps> = ({ children }) => {
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	return isMounted ? <>{children}</> : null;
};

export default ClientSideComponent;
