import { useNavigate } from 'react-router-dom';
import Button from '../../../components/bootstrap/Button';
import Page from '../../../layout/Page/Page';
import Card, {
	CardActions,
	CardBody,
	CardFooter,
	CardHeader,
} from '../../../components/bootstrap/Card';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import Chat, { ChatAvatar, ChatGroup } from '../../../components/Chat';
import InputGroup from '../../../components/bootstrap/forms/InputGroup';
import Textarea from '../../../components/bootstrap/forms/Textarea';
import ThemeContext from '../../../contexts/themeContext';
import { demoPagesMenu } from '../../../menu';
import  { IMessages } from '../../../common/data/chatDummyData';
import React, { SetStateAction, useContext, useState, useEffect ,ChangeEvent} from 'react';
import { fetchConversations, fetchMessagesByConversationId } from '../../../common/data/api';
import axios from 'axios';
import AuthContext from '../../../contexts/authContext';
import Cookies from "js-cookie";

interface MessagesDict {
	[conversationId: string]: IMessages[];
  }

interface WithListChatPageProps {
	onPdfProcessed?: (response: string) => void;
  }

  const WithListBaby = ({ onPdfProcessed }: WithListChatPageProps) => {
	const navigate = useNavigate();
	const { user } = useContext(AuthContext);
	
const csrftoken = Cookies.get("csrftoken");
axios.defaults.headers.common["X-CSRFToken"] = csrftoken;

		const [messageText, setMessageText] = useState('');
		const BASE_URL = 'http://localhost:8000';

		const [activeTab, setActiveTab] = useState<{ conversation_id: number } | null>(null);

		const { mobileDesign } = useContext(ThemeContext);
		const [listShow, setListShow] = useState<boolean>(true);
		const [conversations, setConversations] = useState<any[]>([]);

		const [messages, setMessages] = useState<MessagesDict>({});


		useEffect(() => {
			const fetchData = async () => {
			  const fetchedConversations = await fetchConversations();
			  setConversations(fetchedConversations);
		  
			  if (activeTab && activeTab.conversation_id) {
				const fetchedMessages = await fetchMessagesByConversationId(activeTab.conversation_id);
				setMessages((prevMessages) => ({
				  ...prevMessages,
				  [activeTab.conversation_id]: fetchedMessages,
				}));
			  }
			};
		  
			fetchData();
		  }, [activeTab]);
	  
		function getMessages(conversationId: string) {
			return (
				messages[conversationId]?.map((message) => ({
					id: message.id,
					message: message.text,
					timestamp: message.created_at,
					user: message.user, // Add this line
					isUser: message.is_user
				})) || []
			);
		}

		const handleCreateConversationClick = async () => {
			const token = localStorage.getItem('access_token');
			if (token) {
				await createConversation(token, null);
			  }
		  };

	const createConversation = async (token: string, pdfId: string | null = null) => {
			try {
			  const payload = pdfId ? { pdf_document_id: pdfId } : {};
			  const response = await axios.post(`${BASE_URL}/chat/conversations/`, payload, {
				headers: {
				  'X-CSRFToken': csrftoken,
				  'Content-Type': 'application/json',
				  'X-Requested-With': 'XMLHttpRequest',
				  'Authorization': `Bearer ${token}`,
				},
			  });
			  console.log('Response from createConversation:', response.data);
			  const newConversation = { id: response.data.conversation_id };
			  setConversations((prevConversations) => [...prevConversations, newConversation]);
			  setListShow(newConversation.id);
			  return response.data;
			} catch (error: any) {
			  console.error("Error creating a new conversation:", error);
			  console.log("Error response data:", error.response.data);
			  throw error;
			}
		  };
		  



		function getRandomId() {
			return Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
		  }
		

		const handleSubmit = async (e: React.FormEvent) => {
			e.preventDefault();
			try {
				if (!activeTab) {
					const token = localStorage.getItem('access_token');
					if (token) {
						const newConversation = await createConversation(token, null);
						setActiveTab({ conversation_id: newConversation.conversation_id });
					  }
				}
				else if (!activeTab.conversation_id) {
					throw new Error('Active tab does not have a conversation ID');
				}
				const newMessage: IMessages = {
					id: getRandomId(),
					conversation: String(activeTab?.conversation_id) ?? "user"+String(getRandomId()),
					messages: [{ id: getRandomId(), message: messageText }],
					is_user: true,
					text: messageText,
					created_at: new Date().toISOString(),
					user: {
						id: "some_user_id",
						username: "some_username",
						name: "some_name",
						surname: "some_surname",
						src: "",
						srcSet: "",
						color: "primary",
						password: "some_password",
					},
				};
				  // Add the new user message to the state
				  addNewMessage(newMessage);
				  setMessageText('');

		
				const data = {
					conversation:
					String(activeTab?.conversation_id),
					is_user: true,
					text: messageText,
                    conversation_type : "auto"
				};
		
				const response = await axios.post(`${BASE_URL}/chat/baby_agi/`, data, {
					headers: {
						'X-CSRFToken': csrftoken,
						'Content-Type': 'application/json',
						'X-Requested-With': 'XMLHttpRequest',
						'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
					},
				});
		
				console.log("Response from backend:", response);
		
				if (response.status === 200) {
					// Handle the success case, such as updating the UI with the new message
					

					const configData = JSON.parse(response.config.data);

					console.log(configData)

					const botMessage: IMessages = {
						id: getRandomId(),
						conversation: String(activeTab?.conversation_id) ?? "bot"+String(getRandomId()),
						messages: [{ id: getRandomId(), message: response.data.output.output }],
						is_user: false,
						text: response.data.output.output,
						created_at: new Date().toISOString(),
						user: {
							id: "bot_user_id",
							username: "bot_username",
							name: "bot_name",
							surname: "bot_surname",
							src: "",
							srcSet: "",
							color: "primary",
							password: "bot_password",
						},
					};
					
					
					addNewMessage(botMessage);

					
				} else {
					// Handle the error case, such as showing an error message
				}
			}
			catch (error : any) {
				console.error("Error in handleSubmit:", error);
				console.error("Error response:", error.response);
			  }
		}
		const addNewMessage = (newMessage: IMessages) => {
			setMessages((prevState: MessagesDict) => {
				const conversationId = newMessage.conversation;
		
				if (prevState[conversationId]) {
					return {
						...prevState,
						[conversationId]: [...prevState[conversationId], newMessage],
					};
				} else {
					return {
						...prevState,
						[conversationId]: [newMessage],
					};
				}
			});
		};
		
	  
		const getListShow = async (conversationId: string) => {
			const foundConversation = conversations.find((conv) => conv.id === conversationId);
			const conversationObj = foundConversation ? { conversation_id: foundConversation.id } : null;
			console.log('Found conversation:', conversationObj);
			setActiveTab(conversationObj);
		  
			try {
			  const fetchedMessages = await fetchMessagesByConversationId(conversationObj?.conversation_id);
			  console.log("Fetched",fetchedMessages);
			  setMessages((prevMessages) => ({
				...prevMessages,
				[conversationId]: fetchedMessages,
			  }));
			} catch (error) {
			  console.error('Error fetching messages:', error);
			}
		  
			if (mobileDesign) {
			  setListShow(false);
			}
		  };
		  
		  

		return (
			<PageWrapper title={demoPagesMenu.chat.subMenu.withListChat.text}>
	<Page>
		<div className='row h-100'>
			{listShow && (
				<div className='col-lg-2 col-md-4'>
					<Card stretch>
						<CardHeader>
							<h3>Missions</h3>
						</CardHeader>

						<Button color='info' icon='Send' onClick={handleCreateConversationClick}>
									New Conversation
								</Button>
						<CardBody isScrollable>
  {conversations && conversations.length ? (
    conversations.map((conversation) => (
      <div
        key={conversation.id}
        onClick={() => getListShow(conversation.id)}
        className='list-group-item list-group-item-action'
      >
        {`Conversation ID: ${conversation.id}`}
      </div>
    ))
  ) : (
    <div>No missions to display</div>
  )}
</CardBody>


					</Card>
				</div>
			)}
			{(!listShow || !mobileDesign) && (
				<div className='col-lg-10 col-md-8'>
					<Card stretch>
						<CardHeader>
							<CardActions>
								<div className='d-flex align-items-center'>
									<ChatAvatar
										// eslint-disable-next-line react/jsx-props-no-spreading
										{...activeTab}
										className='me-3'
									/>
									<div className='fw-bold'>
									
									</div>
								</div>
							</CardActions>
						</CardHeader>
						<CardBody isScrollable>
						<Chat>
				

						{activeTab && getMessages(String(activeTab.conversation_id)).map((msg) => {
    console.log('getMessages response:', msg);
    return (
      <ChatGroup
        key={msg.id}
        messages={[{ id: msg.id, message: msg.message }]} 
        user={msg.user || {}}
        timestamp={msg.timestamp}
        isUser={msg.isUser}
      />
    )
  })}
							</Chat>

						</CardBody>
						<CardFooter className='d-block'>
							<InputGroup>
							<Textarea
  value={messageText}
  onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setMessageText(e.target.value)}
/>
								<Button color='info' icon='Send' onClick={handleSubmit}>
									SEND
								</Button>
							</InputGroup>
						</CardFooter>
					</Card>
				</div>
			)}
		</div>
	</Page>
</PageWrapper>

		  );
		  
};

export default WithListBaby;
