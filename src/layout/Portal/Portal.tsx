import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { FC, ReactNode, useEffect, useState } from 'react';

interface IPortalProps {
	children: ReactNode;
	id?: string;
}

const Portal: FC<IPortalProps> = ({ id = 'portal-root', children }) => {
	const [mount, setMount] = useState<Element | null>(null);

	useEffect(() => {
		const div = document.createElement('div');
		div.id = id;
		document.body.appendChild(div);
		setMount(div);
		return () => {
			document.body.removeChild(div);
		};
	}, [id]);

	if (mount) return ReactDOM.createPortal(children, mount);
	return null;
};

Portal.propTypes = {
	children: PropTypes.node.isRequired,
	id: PropTypes.string,
};

export default Portal;
