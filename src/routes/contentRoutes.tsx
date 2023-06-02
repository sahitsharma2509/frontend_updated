import React, { lazy } from 'react';
import { RouteProps } from 'react-router-dom';
import {
	demoPagesMenu,
} from '../menu';
import Login from '../pages/presentation/auth/Login';
import Signup from '../pages/presentation/auth/Login';


const APP = {
	KNOWLEDGE: {
		GRID: lazy(() => import('../pages/presentation/knowledge/KnowledgeGridPage')),
		TEST: lazy(() => import('../pages/presentation/knowledge/test')),
		ITEM: lazy(() => import('../pages/presentation/knowledge/KnowledgeViewPage')),
		
	},
	CHAT: {
		WITH_LIST: lazy(() => import('../pages/presentation/chat/WithListChatPage')),
		TEST : lazy(() => import('../pages/presentation/chat/test')),
		TEST2 : lazy(() => import('../pages/presentation/chat/test2')),
		TEST3 : lazy(() => import('../pages/presentation/chat/test3')),
	},
};


const presentation: RouteProps[] = [
	/**
	 * Landing
	 */

	/** ************************************************** */

	/**
	 * Pages
	 */

	/**
	 * Single Pages
	 */
	
	/**
	 * END - Pages
	 */

	/**
	 * Auth Page
	 */

	{
		path: demoPagesMenu.login.path,
		element: <Login />,
	},
	{
		path: demoPagesMenu.signUp.path,
		element: <Login isSignUp />,
	},

	/**
	 * App
	 */

	/**
	 * App > Project Management
	 */


	/**
	 * App > Knowledge
	 */
	{
		path: demoPagesMenu.knowledge.subMenu.grid.path,
		element: <APP.KNOWLEDGE.GRID />,
	},
	{
		path: demoPagesMenu.knowledge.subMenu.test.path,
		element: <APP.KNOWLEDGE.TEST />,
	},
	{
		path: demoPagesMenu.knowledge.subMenu.item.path,
		element: <APP.KNOWLEDGE.ITEM />,
	},
	

	/**
	 * App > Sales
	 */

	/**
	 * App > Appointment
	 */

	/**
	 * App > CRM
	 */

	/**
	 * App > Chat
	 */
	{
		path: demoPagesMenu.chat.subMenu.withListChat.path,
		element: <APP.CHAT.WITH_LIST />,
	},
	
	
{
	path: demoPagesMenu.chat.subMenu.test2.path,
	element: <APP.CHAT.TEST2 />,
},
{
	path: demoPagesMenu.chat.subMenu.test3.path,
	element: <APP.CHAT.TEST3 />,
},

{
	path: `${demoPagesMenu.chat.subMenu.test3.path}/:knowledgeBaseId`,
	element: <APP.CHAT.TEST3 />,
},
	/**
	 * END - App
	 */

	/** ************************************************** */

	/**
	 * Page Layout Types
	 */
	
];

const contents = [...presentation, ];

export default contents;
