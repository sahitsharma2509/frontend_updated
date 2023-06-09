import { useNavigate, useParams  } from 'react-router-dom';
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
import USERS, { IUserProps } from '../../../common/data/userDummyData';
import ThemeContext from '../../../contexts/themeContext';
import { demoPagesMenu } from '../../../menu';
import  { IMessages } from '../../../common/data/chatDummyData';
import React, { SetStateAction, useContext, useState, useEffect ,ChangeEvent} from 'react';
import { fetchConversations, fetchMessagesByConversationId, fetchPdfDocuments } from '../../../common/data/api';
import axios from 'axios';
import AuthContext from '../../../contexts/authContext';
import Cookies from "js-cookie";
import holderimage from '../../../assets/img/holder.png'
import { ConversationListItem } from '../../../components/Chat';


interface MessagesDict {
	[conversationId: string]: IMessages[];
  }

interface PdfDocument {
  id: number;
  document: {
    name: string;
    size: number;
    type: string;
    lastModified: number;
    lastModifiedDate?: Date;
  };
  timestamp: string;
  user: number;
  name: string;
}

interface Conversation {
	id: number;
	// ... other properties
  }


const WithListPDFPage = () => {
	const navigate = useNavigate();
	const { user } = useContext(AuthContext);
    const [pdfDocuments, setPdfDocuments] = useState<PdfDocument[]>([]);
	

	
const csrftoken = Cookies.get("csrftoken");
axios.defaults.headers.common["X-CSRFToken"] = csrftoken;

		const [messageText, setMessageText] = useState('');
		const BASE_URL = process.env.REACT_APP_DJANGO_BASE_URL
    const [activePdfId, setActivePdfId] = useState('');

		const [activeTab, setActiveTab] = useState<{ conversation_id: number } | null>(null);

		const { mobileDesign } = useContext(ThemeContext);
		const [listShow, setListShow] = useState<boolean>(true);
		const [conversations, setConversations] = useState<any[]>([]);
		const { conversationId } = useParams();

		const [messages, setMessages] = useState<MessagesDict>({});
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

 
		console.log("sup",conversationId);

		// useEffect for fetching and setting conversations based on the conversation id from the URL
useEffect(() => {
	const fetchAndSetConversations = async () => {
		const fetchedConversations = await fetchConversations();
		setConversations(fetchedConversations);
		console.log("hLLLO",conversationId);
		// If there's a conversation id in the URL, set it as the active tab
		if (conversationId) {
			console.log(conversationId);
			const conversationIdNumber = Number(conversationId);
			const foundConversation = fetchedConversations.find((conv: Conversation) => conv.id === conversationIdNumber);
			if (foundConversation) {
				setActiveTab({ conversation_id: foundConversation.id });
			}
		}
	};

	fetchAndSetConversations();
}, [conversationId]);  // Only run when conversationId changes

// useEffect for fetching messages of the active conversation
useEffect(() => {
	const fetchAndSetMessages = async () => {
		// If there's an active tab, fetch its messages
		if (activeTab && activeTab.conversation_id) {
			const fetchedMessages = await fetchMessagesByConversationId(activeTab.conversation_id);
			setMessages((prevMessages) => ({
				...prevMessages,
				[activeTab.conversation_id]: fetchedMessages,
			}));
		}
	};

	fetchAndSetMessages();
}, [activeTab]);  // Only run when activeTab changes
		
/*
		const handleCreateConversationClick = async () => {
			const token = localStorage.getItem('access_token');
			await createConversation(token);
		  };

		
		};

    */	
		function getRandomId() {
			return Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
		  }
		

		const handleSubmit = async (e: React.FormEvent) => {
			e.preventDefault();
			try {
				if (!activeTab) {
					const token = localStorage.getItem('access_token');


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
					conversation_type : "pdf"
          
				};
		
				const response = await axios.post(`${BASE_URL}/answer`, data, {
					headers: {
						'X-CSRFToken': csrftoken,
						'Content-Type': 'application/json',
						'X-Requested-With': 'XMLHttpRequest',
						'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
					},
				});

				
		
				console.log("Response from backend:", response);
        		console.log("response.data.output:", response.data.output);
		
				if (response.status===200) {
					// Handle the success case, such as updating the UI with the new message
					

					const configData = response.data.output

					console.log("Output:",configData)

					const botMessage: IMessages = {
						id: getRandomId(),
						conversation: String(activeTab?.conversation_id) ?? "bot"+String(getRandomId()),
						messages: [{ id: getRandomId(), message: response.data.output }],
						is_user: false,
						text: response.data.output,
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
          console.log("Whyyyy")
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
            <PageWrapper title={demoPagesMenu.chat.subMenu.test3.text}>
            <Page>
              <div className='row h-100'>
              {listShow && (
  <div className='col-lg-2 col-md-4'>
    <Card stretch>
      <CardHeader>
        <h3>PDF Conversations</h3>
      </CardHeader>
      <Button color='info' icon='Send'>
        New Conversation
      </Button>
      <CardBody isScrollable>
        {conversations && conversations.length ? (
          conversations
		  .filter((conv) => conv.pdf_document !== null)
		  .map((conv) => (
			<ConversationListItem
			  key={conv.id}
			  id={conv.id.toString()}
			  title={conv.title || 'Untitled PDF Conversation'}
			  className='list-group-item list-group-item-action'
			  onClick={() => getListShow(conv.id)}
			  isActive={activeTab?.conversation_id === conv.id}
			/>
		  ))
        ) : (
          <div>No PDF conversations available</div>
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
                            getMessages(String(activeTab.conversation_id)).map((msg) => {
                              console.log('getMessages response:', msg);
                              return (
                                <ChatGroup
                                  key={msg.id}
                                  messages={[
                                    { id: msg.id, message: msg.message },
                                  ]}
                                  user={msg.user || {}}
                                  timestamp={msg.timestamp}
                                  isUser={msg.isUser}
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

export default WithListPDFPage;
