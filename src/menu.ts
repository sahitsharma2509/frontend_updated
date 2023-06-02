
export const demoPagesMenu = {

	app: {
		id: 'app',
		text: 'Apps',
		icon: 'Extension',
	},
	knowledge: {
		id: 'knowledge',
		text: 'Knowledge',
		path: 'knowledge',
		icon: 'AutoStories',
		subMenu: {
			grid: {
				id: 'grid',
				text: 'Knowledge Grid',
				path: 'knowledge/grid',
				icon: 'AutoStories',
			},
			test: {
				id: 'test',
				text: 'test',
				path: 'knowledge/test',
				icon: 'AutoStories',
			},
			itemID: {
				id: 'itemID',
				text: 'itemID',
				path: 'knowledge/item',
				hide: true,
			},
			item: {
				id: 'item',
				text: 'Item',
				path: 'knowledge/item/1',
				icon: 'Book',
			},
		},
	},
	chat: {
		id: 'chat',
		text: 'Chat',
		path: 'chat',
		icon: 'Forum',
		subMenu: {
			withListChat: {
				id: 'withListChat',
				text: 'AI-Chat',
				path: 'chat/with-list',
				icon: 'Quickreply',
			},
			test2: {
				id: 'withListBaby',
				text: 'Chat with BabyAGI',
				path: 'chat/test2',
				icon: 'Quickreply',
			},
			test3: {
				id: 'withListYT',
				text: 'Chat with Docs',
				path: 'chat/test3',
				icon: 'Quickreply',
			},

		},
	},

	auth: {
		id: 'auth',
		text: 'Auth Pages',
		icon: 'Extension',
	},
	login: {
		id: 'login',
		text: 'Login',
		path: 'auth/login',
		icon: 'Login',
	},
	signUp: {
		id: 'signUp',
		text: 'Sign Up',
		path: 'auth/sign-up',
		icon: 'PersonAdd',
	},
};

