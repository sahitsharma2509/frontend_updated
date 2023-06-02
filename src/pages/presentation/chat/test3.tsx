import { useNavigate , useParams} from 'react-router-dom';
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
import React, { SetStateAction, useContext, useState, useEffect ,ChangeEvent,useRef} from 'react';
import { fetchConversations, fetchMessagesByConversationId } from '../../../common/data/api';
import axios from 'axios';
import AuthContext from '../../../contexts/authContext';
import Cookies from "js-cookie";
import Select from '../../../components/bootstrap/forms/Select';
import { createConversation } from '../../../common/data/conversationUtils';
import { ConversationListItem } from '../../../components/Chat';


interface MessagesDict {
	[conversationId: string]: IMessages[];
  }

  export interface KnowledgeDocument {
    id: number;
    document_type: string;
    data: any;  // or define a more specific type if you know the structure of the JSON data
}


export interface KnowledgeBase {
    id: number;
    name: string;
    user: number;
    documents: KnowledgeDocument[];  // Add this line
    documents_count?: number;  // Add this line if you want to include a count of documents
}



const WithListYTPage = () => {
	const navigate = useNavigate();
	const { user } = useContext(AuthContext);
const csrftoken = Cookies.get("csrftoken");
axios.defaults.headers.common["X-CSRFToken"] = csrftoken;

		const [messageText, setMessageText] = useState('');
		const BASE_URL = process.env.REACT_APP_DJANGO_BASE_URL

		const [activeTab, setActiveTab] = useState<{ conversation_id: number } | null>(null);

		const { mobileDesign } = useContext(ThemeContext);
		const [listShow, setListShow] = useState<boolean>(true);
		const [conversations, setConversations] = useState<any[]>([]);

		const [messages, setMessages] = useState<MessagesDict>({});
		const [isBotTyping, setIsBotTyping] = useState(false);

		const [selectedConversation, setSelectedConversation] = useState(null);
		const lastMessageRef = useRef<HTMLDivElement | null>(null);




		const [selectedKnowledgebase, setSelectedKnowledgebase] = useState('');

		const { knowledgeBaseId } = useParams();


		const [knowledgeBases, setKnowledgeBases] = useState<KnowledgeBase[]>([]);
		const [socket, setSocket] = useState<WebSocket | null>(null);




	
		useEffect(() => {
			const token = localStorage.getItem('access_token');

			let newSocket: WebSocket | null = null;  // Explicitly initialize it to null
		  
			if (activeTab) {
			  // Create a new WebSocket connection
			  const newSocket = new WebSocket(`ws://localhost:8000/ws/chat/${activeTab.conversation_id}/?token=${token}`);
			  console.log('WebSocket connection created:', activeTab.conversation_id); 
		  
			  // Listen for messages
			  const handleMessage = (event: MessageEvent) => {
				const message = JSON.parse(event.data);
				console.log('Received message:', message); 
			  
				setIsBotTyping(true);
			  
				setMessages((prevState: MessagesDict) => {
				  const conversationId = String(activeTab?.conversation_id) ?? "bot"+String(getRandomId());
				  
				  // Create a new message
				  const newMessage: IMessages = {
					id: getRandomId(),
					conversation: conversationId,
					messages: [{ id: getRandomId(), message: message.message }],
					is_user: false,
					text: message.message,
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
					
				  // Add the new message to the conversation's message array
				  const newMessages = [...(prevState[conversationId] || []), newMessage];
			  
				  // If the message ends with a special character (e.g., a period), set isBotTyping to false

			  
				  return {
					...prevState,
					[conversationId]: newMessages,
				  };
				});
			  };
			  
			  newSocket.addEventListener('message', handleMessage);
		  
			  setSocket(newSocket);
		  
			  return () => {
				// Remove event listener
				if (newSocket) {
					newSocket.removeEventListener('message', handleMessage);
			
					// Close the WebSocket connection when the component unmounts
					newSocket.close();
					console.log('WebSocket connection closed:', activeTab.conversation_id);
			
					setIsBotTyping(false); // Stop bot from "typing" when the WebSocket connection is closed
				}
			};
			
			}
		  }, [activeTab]);
		  
		  
		useEffect(() => {
			const fetchKnowledgebases = async () => {
				const response = await axios.get(`${BASE_URL}/knowledgebases/`, {
					headers: {
						'X-CSRFToken': csrftoken,
						'Content-Type': 'application/json',
						'X-Requested-With': 'XMLHttpRequest',
						'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
					},
				});
				setKnowledgeBases(response.data);
		
				// After fetching knowledge bases, check if the knowledgeBaseId from the URL exists in the data
				const urlKnowledgeBase = response.data.find((kb: KnowledgeBase) => kb.id === parseInt(knowledgeBaseId || ''));
				if (urlKnowledgeBase) {
					setSelectedKnowledgebase(urlKnowledgeBase.id.toString());
				}
			};
		
			fetchKnowledgebases();
		}, []);

		useEffect(() => {
			if (selectedConversation) {
			  fetchMessages(selectedConversation);
			}
		  }, [selectedConversation]);

	


		  const fetchMessages = async (conversationId : number) => {
			try {
			  const fetchedMessages = await fetchMessagesByConversationId(conversationId);
			  console.log("Fetched",fetchedMessages);
			  setMessages((prevMessages) => ({
				...prevMessages,
				[conversationId]: fetchedMessages,
			  }));
			} catch (error) {
			  console.error('Error fetching messages:', error);
			}
		  };
		
		
		useEffect(() => {
			const createConversationIfUrlMatches = async () => {
				if (knowledgeBaseId && selectedKnowledgebase === knowledgeBaseId) {
					const token = localStorage.getItem('access_token');
					const newConversation = await createConversation(token, selectedKnowledgebase);
		
					// If a new conversation was successfully created, set it as the active tab
					if (newConversation) {
						setActiveTab({ conversation_id: newConversation.id });
					}
				}
			};
		
			createConversationIfUrlMatches();
		}, [knowledgeBaseId, selectedKnowledgebase]);
		


        function getMessages(conversationId: string) {
			return (
				messages[conversationId]?.map((message, index, array) => ({
					id: message.id,
					message: message.text,
					timestamp: message.created_at,
					user: message.user,
					isUser: message.is_user,
					isLastMessage: index === array.length - 1
				})) || []
			);
		}

		useEffect(() => {
			lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
		}, [messages]);
		

 


		useEffect(() => {
			const fetchData = async () => {
			  const fetchedConversations = await fetchConversations();
			  setConversations(fetchedConversations);
		  
			  
			};
		  
			fetchData();
		  }, [activeTab]);
	  
		
		  const handleCreateConversationClick = async () => {
			const token = localStorage.getItem('access_token');
			const newConversation = await createConversation(token, selectedKnowledgebase);
  			setActiveTab({ conversation_id: newConversation.id });
		};

		



		function getRandomId() {
			return Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
		  }
		

		  const handleSubmit = async (e: React.FormEvent) => {
			console.log("Test")
			e.preventDefault();
			try {
			  if (!activeTab) {
				throw new Error('Active tab is not set');
			  }
		  
			  if (!activeTab.conversation_id) {
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

			  await new Promise(resolve => setTimeout(resolve, 0));
		  
			  const data = {
				conversation: String(activeTab?.conversation_id),
				is_user: true,
				text: messageText,
			  };
		  
			  // Send the message over the WebSocket connection
			  if (socket && socket.readyState === WebSocket.OPEN) {
				socket.send(JSON.stringify(data));
			  } else {
				console.error('Cannot send message, WebSocket is not open');
			  }
			} catch (error : any) {
			  console.error("Error in handleSubmit:", error);
			  console.error("Error response:", error.response);
			}
		  }
		  
    
		  const addNewMessage = (newMessage: IMessages) => {
			console.log('Adding new message:', newMessage);  // Log the new message

		
			setMessages((prevState: MessagesDict) => {
				const conversationId = newMessage.conversation;
		
				if (prevState[conversationId]) {
					console.log('Adding message to existing conversation:', conversationId);  // Log the conversation ID
		
					const updatedMessages = {
						...prevState,
						[conversationId]: [...prevState[conversationId], newMessage],
					};
		
					console.log('Updated messages:', updatedMessages);  // Log the updated messages
		
					return updatedMessages;
				} else {
					console.log('Adding message to new conversation:', conversationId);  // Log the conversation ID
		
					const updatedMessages = {
						...prevState,
						[conversationId]: [newMessage],
					};
		
					console.log('Updated messages:', updatedMessages);  // Log the updated messages
		
					return updatedMessages;
				}
			});
		};
		
	  	  
		const getListShow = async (conversationId: string) => {
			const foundConversation = conversations.find((conv) => conv.id === conversationId);
			const conversationObj = foundConversation ? { conversation_id: foundConversation.id } : null;
			console.log('Found conversation:', conversationObj);
			setActiveTab(conversationObj);
		  
			if (conversationObj?.conversation_id) {
			  setSelectedConversation(conversationObj.conversation_id);
			}
		  
			if (mobileDesign) {
			  setListShow(false);
			}
		  };


		return (
            <PageWrapper title={demoPagesMenu.chat.subMenu.test3.text}>
            <Page>
              <div className='row h-100'>
              {listShow && (
  <div className='col-lg-2 col-md-4'>
    <Card stretch>
      <CardHeader>
        <h3>Private Chat</h3>
      </CardHeader>
	  <Select
                                    value={selectedKnowledgebase}
                                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                        setSelectedKnowledgebase(e.target.value);
                                        console.log('Knowledge base selected:', e.target.value); // Debugging line
                                    }}
                                    ariaLabel='Knowledgebase'
                                >
                                    {knowledgeBases.map((kb) => (
                                        <option key={kb.id} value={kb.id}>
                                            {kb.name}
                                        </option>
                                    ))}
                                </Select>
<Button color='info' icon='Chat' onClick={handleCreateConversationClick} className='padding-y'>
	New Conversation
</Button>
<CardBody isScrollable>
  {conversations && conversations.length ? (
    conversations
      .filter((conv) => conv.knowledge_base !== null)
      .map((conv) => (
        <ConversationListItem
          key={conv.id}
          id={conv.id.toString()}
          title={conv.knowledge_base.name}
          className='list-group-item list-group-item-action'
          onClick={() => getListShow(conv.id)}
          isActive={activeTab?.conversation_id === conv.id}
        />
      ))
  ) : (
    <div>No Private conversations available</div>
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
                            <div className='fw-bold'></div>
                          </div>
                        </CardActions>
                      </CardHeader>
                      <CardBody isScrollable>
                      <Chat>
    {activeTab &&
        getMessages(String(activeTab.conversation_id)).map((msg, i, arr) => {
            return (
                <ChatGroup
                    ref={msg.isLastMessage ? lastMessageRef : null}
                    key={msg.id}
                    messages={[
                        { id: msg.id, message: msg.message },
                    ]}
                    user={msg.user || {}}
                    timestamp={msg.timestamp}
                    isUser={msg.isUser}
                    isNewConversation={isBotTyping}
                />
            );
        })}
</Chat>
                      </CardBody>
                      <CardFooter className='d-block'>
                        <InputGroup>
                          <Textarea
                            value={messageText}
                            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                              setMessageText(e.target.value)
                            }
                          />
                          <Button type="button" color='info' icon='Send' onClick={handleSubmit}>
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

export default WithListYTPage;
