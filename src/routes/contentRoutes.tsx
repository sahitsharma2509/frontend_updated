import React, { lazy } from 'react';
import { RouteProps } from 'react-router-dom';
import {
	demoPagesMenu,
} from '../menu';
import Login from '../pages/auth/login';
import Signup from '../pages/auth/login';


const APP = {
	KNOWLEDGE: {
		GRID: lazy(() => import('../pages/knowledge/grid')),
		TEST: lazy(() => import('../pages/knowledge/test')),
		ITEM: lazy(() => import('../pages/knowledge/item')),
		
	},
	CHAT: {
		WITH_LIST: lazy(() => import('../pages/chat')),
		TEST : lazy(() => import('../pages/chat/test')),
		TEST2 : lazy(() => import('../pages/chat/test2')),
		TEST3 : lazy(() => import('../pages/chat/private')),
	},
};


const presentation: RouteProps[] = [
	

	{
		path: demoPagesMenu.login.path,
		element: <Login />,
	},
	{
		path: demoPagesMenu.signUp.path,
		element: <Login isSignUp />,
	},

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

	
];

const contents = [...presentation, ];

export default contents;
