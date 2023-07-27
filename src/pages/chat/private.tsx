import { useNavigate , useParams} from 'react-router-dom';
import Button from '../../components/bootstrap/Button';
import { Upload, message, UploadFile, UploadProps , Progress } from 'antd';
import Page from '../../layout/Page/Page';
import Card, {
	CardActions,
	CardBody,
	CardFooter,
	CardHeader,
} from '../../components/bootstrap/Card';

import Chat, { ChatAvatar, ChatGroup } from '../../components/Chat';
import InputGroup from '../../components/bootstrap/forms/InputGroup';
import Textarea from '../../components/bootstrap/forms/Textarea';
import ThemeContext from '../../contexts/themeContext';
import { demoPagesMenu } from '../../menu';
import  { IMessages } from '../../common/data/chatDummyData';
import React, { SetStateAction, useContext, useState, useEffect ,ChangeEvent,useRef, useCallback} from 'react';
import { fetchConversations, fetchMessagesByConversationId, fetchKnowledgebases } from '../../common/data/api';
import axios from 'axios';
import AuthContext from '../../contexts/authContext';
import Cookies from "js-cookie";
import Select from '../../components/bootstrap/forms/Select';
import { createConversation } from '../../common/data/conversationUtils';
import { ConversationListItem, ChatHeader } from '../../components/Chat';
import Spinner from '../../components/bootstrap/Spinner';
import SubHeader, { SubHeaderLeft, SubHeaderRight } from '../../layout/SubHeader/SubHeader';
import Icon from '../../components/icon/Icon';
import { AIModal } from '../presentation/chat/components/Modal';
import Layout from '../../components/Layout';
import { useRouter } from 'next/router'
import { useMutation, useQueryClient } from 'react-query';
import { useInfiniteQuery, useQuery } from 'react-query';
import showNotification from '../../components/extras/showNotification';
import  { Spin  } from 'antd';
import CustomTextarea from '../../components/Chatbox';
import { Tiktoken } from '@dqbd/tiktoken';


import { PlusCircleOutlined,FilePdfTwoTone, DeleteOutlined } from '@ant-design/icons';

interface MessagesDict {
	[conversationId: string]: IMessages[];
  }

  export interface KnowledgeDocument {
    id: number;
    document_type: string;
    data: any;  // or define a more specific type if you know the structure of the JSON data
}

type Conversation = {
	id: number;
	user: number;
	knowledge_base: any | null;
	created_at: string;
	title: string | null;
  };
  
  type Page = {
	count: number;
	next: string | null;
	previous: string | null;
	results: Array<Conversation>;
  };
  
  type OldData = {
	pages: Array<Page>;
	pageParams: Array<any>;
  };



export interface KnowledgeBase {
    id: number;
    name: string;
    user: number;
    documents: KnowledgeDocument[];  // Add this line
    documents_count?: number;  // Add this line if you want to include a count of documents
}






const WithListYTPage = () => {
	const csrftoken = Cookies.get("csrftoken");
	axios.defaults.headers.common["X-CSRFToken"] = csrftoken;
		const [isLoading, setIsLoading] = useState(false);
		const [fileName, setFileName] = useState<string>('');
		const { userProfileData } = useContext(AuthContext);

		const [messageText, setMessageText] = useState('');
		const BASE_URL = process.env.NEXT_PUBLIC_DJANGO_BASE_URL;

		const [activeTab, setActiveTab] = useState<{ conversation_id: number } | null>(null);

		const { mobileDesign } = useContext(ThemeContext);
		const [listShow, setListShow] = useState<boolean>(true);
		const [conversations, setConversations] = useState<any[]>([]);

		const [messages, setMessages] = useState<MessagesDict>({});
		const [isBotTyping, setIsBotTyping] = useState(false);

		const [selectedConversation, setSelectedConversation] = useState(null);
		const lastMessageRef = useRef<HTMLDivElement | null>(null);

		const [isAIModalOpen, setIsAIModalOpen] = useState(false);
		const { data: knowledgeBases, isLoading: isKnowledgeBasesLoading } = useQuery('knowledgebases', fetchKnowledgebases);
		const [fileContent, setFileContent] = useState('');
  		const [isFileUploaded, setIsFileUploaded] = useState(false);
		  // Add this line at the top of your component with other state variables
const [isFileUploading, setIsFileUploading] = useState(false);

const [selectedConversationDetails, setSelectedConversationDetails] = useState({ conversation_id: null, conversation_title: "", knowledge_base: "" });
const [tokenLimitReached, setTokenLimitReached] = useState(false);


const [tokensRemaining, settokensRemaining] = useState(0);

// Declare a new state variable
const [hasNotificationBeenShown, setHasNotificationBeenShown] = useState(false);


  
  

useEffect(() => {
    console.log('Component re-rendered');
}, []);






		const [selectedKnowledgebase, setSelectedKnowledgebase] = useState('');

		const router = useRouter();
		const knowledgeBaseId = router.query.knowledgeBaseId?.toString() || '';
		const scrollRef = useRef<HTMLDivElement>(null);

		const props = {
			action: '#',
			listType: 'text' as 'text',
			onRemove: () => {
			  setMessageText('');
			  setFileName('');
			  setIsFileUploading(false);
			},
			beforeUpload: (file: any) => {
				const formData = new FormData();
				formData.append('file', file);
				
				// Append conversation_id to formData
				if (activeTab && activeTab.conversation_id) {
				  formData.append('conversation_id', activeTab.conversation_id.toString());
				}
			  
				console.log("conv_id:",activeTab?.conversation_id.toString())


				setIsFileUploading(true);
				setFileName(file.name);
				
				axios.post(`${BASE_URL}/api/upload/`, formData, {
				  headers: {
					'Content-Type': 'multipart/form-data',
					'Authorization': `Bearer ${localStorage.getItem("access_token")}`, 
				  },
				})
				.then(response => {
					setIsFileUploading(false);
					setIsFileUploaded(true); // Add this line
					console.log(response.data);
				  })
				  
				.catch(error => {
				  setIsFileUploading(false);
				  console.error(error);
				});
			  
				return false;
			  },
			  
			onChange: (info: any) => {},
			showUploadList: {
			  showPreviewIcon: true,
			  showRemoveIcon: true,
			  showDownloadIcon: true,
			}
		  };
		  
	
		const [socket, setSocket] = useState<WebSocket | null>(null);
		const [initialMessageDisplayed, setInitialMessageDisplayed] = useState<{ [id: string]: boolean }>({});
		

		const queryClient = useQueryClient();
		const mutation = useMutation((data: { token: string | null, knowledgebaseId: string }) => createConversation(data.token, data.knowledgebaseId), {
 						 onSuccess: (data) => {
   						 queryClient.invalidateQueries('conversations'); // This will invalidate cache for 'conversations', triggering a refetch
    					 setActiveTab({ conversation_id: data.conversation_id });
						 setSelectedConversation(data.conversation_id.toString());
  
  												},
  						 onError: (error) => {
    					console.error('Error creating new conversation, please try again.', error);
  						},
						});



		const deleteMutation = useMutation((id: string) => axios.delete(`${BASE_URL}/api/conversations/${id}/`, {
							headers: {
							  'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
							},
						  }), {
							onSuccess: (data, variables) => {
							  console.log('Mutation result:', data); // Log the mutation result
							  console.log('Mutation variables:', variables); // Log the mutation variables
							  showNotification(
								'Delete Successful', // Title
								`Conversation ${variables} deleted`, // Message
								'info' // Type
							  );
						  
							  console.log('Before deletion data:', queryClient.getQueryData('conversations')); // Log the cache data before deletion
						  
							  // Update the cache to remove the deleted conversation
							  queryClient.setQueryData('conversations', (oldData: OldData | undefined) => {
								console.log('Old data:', oldData); // Log the old data
						  
								oldData = oldData || { pages: [], pageParams: [] };
								const newData = {
								  ...oldData,
								  pages: oldData.pages.map((page: Page) => ({
									...page,
									results: page.results.filter((conversation: Conversation) => conversation.id !== parseInt(variables)),
								  })),
								};
						  
								console.log('New data:', newData); // Log the new data
						  
								return newData;
							  });
						  
							  // Invalidate the query to cause a re-fetch next time the data is needed
							  queryClient.removeQueries('conversations');
							},
							onError: (error, variables) => {
							  console.error(`Failed to delete conversation with id ${variables}`, error);
							  showNotification(
								'Delete Failed', // Title
								`Failed to delete conversation ${variables}`, // Message
								'danger' // Type
							  );
							},
							onSettled: () => {
							  // Ensure the data is re-fetched immediately after the mutation
							  queryClient.invalidateQueries('conversations');
							},
						  });
						  
  

		useEffect(() => {
			const token = localStorage.getItem('access_token');
		
			let newSocket: WebSocket | null = null;  // Explicitly initialize it to null
		  
			if (activeTab && activeTab.conversation_id) {
			  // Create a new WebSocket connection
			  const newSocket = new WebSocket(`ws://localhost:8000/ws/chat/${activeTab.conversation_id}/?token=${token}`);
			  console.log('WebSocket connection created:', activeTab.conversation_id); 
		
			  // Listen for messages
			  const handleMessage = (event: MessageEvent) => {
				

				const data = JSON.parse(event.data);
				console.log("Data:",data)


				// Handle the tokens_used received from backend
				const tokens_left = data.tokens_used;

				settokensRemaining(tokens_left);
				console.log('Tokens left:', tokens_left);
		
				// Decode the base64 message
				const message = new TextDecoder('utf-8').decode(Uint8Array.from(atob(data.message), c => c.charCodeAt(0)));


			  
				setIsBotTyping(true);
				setIsLoading(false);
			  
				setMessages((prevState: MessagesDict) => {
				  const conversationId = String(activeTab?.conversation_id) ?? "bot"+String(getRandomId());
		
				  
				  // Create a new message
				  const newMessage: IMessages = {
					id: getRandomId(),
					conversation: conversationId,
					messages: [{ id: getRandomId(), message: message }],
					is_user: false,
					text: message,
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
			  
				  return {
					...prevState,
					[conversationId]: newMessages,
				  };
				});
			  };
			  setIsLoading(false);
		
			  newSocket.addEventListener('message', handleMessage);
		  
			  setSocket(newSocket);
		  
			  return () => {
				// Remove event listener
				if (newSocket) {
					newSocket.removeEventListener('message', handleMessage);
		
					// Close the WebSocket connection when the component unmounts
					newSocket.close();
					console.log('WebSocket connection closed:', activeTab.conversation_id);
					setIsLoading(false);
		
					setIsBotTyping(false); // Stop bot from "typing" when the WebSocket connection is closed
				}
			  };
			}
		  }, [activeTab]);
		


		useEffect(() => {
			// After fetching knowledge bases, check if the knowledgeBaseId from the URL exists in the data
			const urlKnowledgeBase = knowledgeBases?.find((kb: KnowledgeBase) => kb.id === parseInt(knowledgeBaseId || ''));
			if (urlKnowledgeBase) {
				setSelectedKnowledgebase(urlKnowledgeBase.id.toString());
			}
		}, [knowledgeBaseId, knowledgeBases]);





		useEffect(() => {
			if (selectedConversation) {
			  fetchMessages(selectedConversation);
			}
		  }, [selectedConversation]);


		  const fetchMessages = async (conversationId: number) => {
			try {
			  const conversationIdStr = conversationId.toString();  // Convert conversationId to string
		  
			  const fetchedMessages = await fetchMessagesByConversationId(conversationId);
			  console.log("Fetched", fetchedMessages);
		  
			  // Check if fetchedMessages is not null, undefined, and it's an array
			  if (fetchedMessages && Array.isArray(fetchedMessages) && fetchedMessages.length > 0) {
				
				// Check if initial message hasn't been displayed yet
				if (!initialMessageDisplayed[conversationIdStr]) {
				  setIsBotTyping(true);  // Start the typing effect
		  
				  setMessages((prevMessages) => ({
					...prevMessages,
					[conversationIdStr]: fetchedMessages,
				  }));
		  
				  // Mark the initial message as displayed
				  setInitialMessageDisplayed(prev => ({ ...prev, [conversationIdStr]: true }));
		  
				  setIsBotTyping(false);  // Stop the typing effect
				} else {
				  // If there's no initial message to display, just add the messages to state
				  setMessages((prevMessages) => ({
					...prevMessages,
					[conversationIdStr]: fetchedMessages,
				  }));
				}
			  }
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
				// and trigger fetching messages for this conversation.
				if (newConversation && newConversation.id) {
				  setActiveTab({ conversation_id: newConversation.id });
				  setSelectedConversation(newConversation.id.toString());
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
					isLastMessage: index === array.length - 1,
					isFile: message.isFile,
					fileName : message.fileName
				})) || []
			);
		}

		useEffect(() => {
			lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
		}, [messages]);
		
	
		const {
			data,
			fetchNextPage,
			hasNextPage,
			isFetchingNextPage,
			status,
			error
		  } = useInfiniteQuery('conversations', fetchConversations, {
			getNextPageParam: (lastPage) => {
				const nextPage = lastPage.next ? new URL(lastPage.next).searchParams.get('page') : undefined;
				return nextPage ? Number(nextPage) : undefined;
			  },
			  
		  });
		  
		  // Log status of the query

		  
		  // Log error if any
		  if (status === 'error') console.error('Query error:', error);
		  
		  // Log when fetching next page starts
		  if (isFetchingNextPage) console.log('Fetching next page...');
		  
		  // Log data		
		  
		  useEffect(() => {
			if (data) {
			  console.log('Setting conversations...');
			  setConversations(data.pages.flatMap(page => page.results));
			}
		  }, [data]);
		  

		  // Load more conversations when scroll reaches end
		  useEffect(() => {
			const scrollListener = () => {
			  if (scrollRef.current) {
				// add a small offset to account for the size of the scrollbar
				const offset = 10;
				if (
				  scrollRef.current.scrollTop + scrollRef.current.clientHeight + offset >=
				  scrollRef.current.scrollHeight
				) {
				  if (!isFetchingNextPage && hasNextPage) {
					fetchNextPage();
				  }
				}
			  }
			};
		  
			if (scrollRef.current) {
			  scrollRef.current.addEventListener('scroll', scrollListener);
			}
		  
			// Cleanup function to remove the event listener
			return () => {
			  if (scrollRef.current) {
				scrollRef.current.removeEventListener('scroll', scrollListener);
			  }
			};
		  }, [fetchNextPage, isFetchingNextPage, hasNextPage]);
		  

		
		  const handleCreateConversationClick = () => {
			const token = localStorage.getItem('access_token');
			const knowledgeBaseIdToUse = knowledgeBaseId || selectedKnowledgebase;
			mutation.mutate({ token, knowledgebaseId: knowledgeBaseIdToUse });
		  };
		  
	
		function getRandomId() {
			return Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
		  }
		
		  const handleSubmit = async (e: React.FormEvent) => {
			setIsLoading(true);
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
				isFile: isFileUploaded, 
				fileName: isFileUploaded ? fileName : '', 
				isAlert: false, // User's message is not an alert
		
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
			  setIsFileUploaded(false);
			  setFileName('');
		
			  console.log("Tokens :", userProfileData?.tokens_used);
			  console.log("Tokens limit:", userProfileData?.token_limit);
		
			  await new Promise(resolve => setTimeout(resolve, 0));
		
			  const data = {
				conversation: String(activeTab?.conversation_id),
				is_user: true,
				text: messageText,
			  };
		
			  let tokenLimit = userProfileData?.token_limit || 0;
			  let tokensUsed = tokenLimit - tokensRemaining;
			  let percentUsed = (tokensUsed / tokenLimit) * 100;

			  console.log("Tokens remaining",tokensRemaining);
		
			  if (percentUsed >= 95 && percentUsed < 100) {
				showNotification(
				  'Token limit warning', 
				  `You have used over ${Math.round(percentUsed)}% of your token limit`, 
				  'warning'
				);
			  }
		
			  if (tokensRemaining === 0 && userProfileData?.tokens_remaining === 0) {
				const alertMessage: IMessages = {
				  ...newMessage,
				  is_user: false,
				  text: "Token limit has been reached. Message not sent.",
				  isAlert: true,
				};
				
				addNewMessage(alertMessage);
				setIsLoading(false);
			  }
			  
			  
			 else {
				// Send the message over the WebSocket connection
				if (socket && socket.readyState === WebSocket.OPEN) {
				  socket.send(JSON.stringify(data));
				} else {
				  setIsLoading(false);
				  console.error('Cannot send message, WebSocket is not open');
				}
			  }
			} catch (error : any) {
			  setIsLoading(false);
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
			if (data) {
			  const allConversations = data.pages.flatMap(page => page.results);
			  const foundConversation = allConversations.find((conv) => conv.id === parseInt(conversationId))
			  console.log("Everything",foundConversation)
			  const conversationObj = foundConversation ? { conversation_id: foundConversation.id, conversation_title:foundConversation.title, kb_name :foundConversation.knowledge_base.name } : null;
			  console.log('Found conversation:', conversationObj);
			  setActiveTab(conversationObj);
			  const selectedConvDetails = foundConversation ?
    { 
      conversation_id: foundConversation.id,
      conversation_title: foundConversation.title, 
      knowledge_base: foundConversation.knowledge_base.name 
    } : { conversation_id: null, conversation_title: "", knowledge_base: "" };
			  setSelectedConversationDetails(selectedConvDetails);
		  
			  if (conversationObj?.conversation_id) {
				setSelectedConversation(conversationObj.conversation_id.toString());
			  }
		  
			  if (mobileDesign) {
				setListShow(false);
			  }
			}
		  };
		  
		  const handleDelete = (id: string) => {
			try {
			  // Use mutation to send a DELETE request
			  deleteMutation.mutate(id);
			} catch (error) {
			  console.error(`Failed to delete conversation with id ${id}`, error);
			}
		  };




		return (
            <Layout title={demoPagesMenu.chat.subMenu.test3.text} hideHeader={true}>
				
            <Page>
              <div className='row h-100'>
              {listShow && (
  <div className='col-lg-2 col-md-4'>
    <Card stretch>
      <CardHeader>
	  <Select
                                    value={selectedKnowledgebase}
                                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                        setSelectedKnowledgebase(e.target.value);
                                        console.log('Knowledge base selected:', e.target.value); // Debugging line
                                    }}
                                    ariaLabel='Knowledgebase'
                                >
                                   {knowledgeBases && knowledgeBases.map((kb: KnowledgeBase) => (
   <option key={kb.id} value={kb.id}>
      {kb.name}
   </option>
))}

                                </Select>
        
      </CardHeader>
	
<Button color='info' icon='Chat' onClick={handleCreateConversationClick} className='padding-y'>
	New Conversation
</Button>
<CardBody ref={scrollRef} isScrollable>
  {data && data.pages.length ? (
    data.pages.flatMap((page) => 
      page.results.filter((conv: Conversation) => conv.knowledge_base !== null)
        .map((conv: Conversation) => (
          <ConversationListItem
            key={conv.id}
            id={conv.id.toString()}
            title={conv.knowledge_base.name}
			conversationTitle={conv.title || "Untitled"}
            className='list-group-item list-group-item-action'
            onClick={() => getListShow(conv.id.toString())}
            isActive={activeTab?.conversation_id === conv.id}
            onDelete={handleDelete}
          />
        ))
    )
  ) : (
    <div>No Private conversations available</div>
  )}
  {isFetchingNextPage && <Spinner />}
</CardBody>

    </Card>
  </div>
)}

                {(!listShow || !mobileDesign) && (
                  <div className='col-lg-10 col-md-8'>
                    <Card stretch>
                      <CardHeader>
					  <ChatHeader 
    conversation_title={selectedConversationDetails.conversation_title} 
    knowledge_base={selectedConversationDetails.knowledge_base} 
  />
					  

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
						{ 
							id: msg.id, 
							message: msg.message,
							isFile: msg.isFile,      // add this line
							fileName: msg.fileName   // add this line
						},
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
					  <InputGroup id="chatinput" className='border border-dark rounded-top bg-l90-dark'>
  <div style={{display: 'flex', alignItems: 'center'}}>
    {!isFileUploaded && !isFileUploading && (
      <Upload {...props}>
        <PlusCircleOutlined style={{ fontSize: '20px' , padding:'5px', paddingRight:'8px',}} />
      </Upload>
    )}
  </div>
  
  <div style={{ position: 'relative', flex: '1 1 auto' }}>
  <CustomTextarea
  value={messageText}
  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
    setMessageText(e.target.value)
  }
/>

    
    {isFileUploaded && !isFileUploading && (
      <div className='d-inline'
        style={{ 
          display:'flex',
          alignItems: 'center', 
          backgroundColor: 'rgba(0,0,0,0.6)', 
          color: '#fff',
          padding: '8px', 
          borderRadius: '5px',
          zIndex: 1,
        }}
      >
        <FilePdfTwoTone style={{ marginRight: '10px'  }}  />
        {fileName}
        <DeleteOutlined 
          style={{ 
            marginLeft: '10px',
            color: '#f00',
            cursor: 'pointer' 
          }}
          onClick={() => {
            setMessageText('');
            setFileName('');
            setIsFileUploaded(false);
          }}
        />
      </div>
    )}
    {isFileUploading && (
      <div 
        style={{ 
          position: 'absolute',
          top: 0,
          left: 0,
          display: 'flex', 
          alignItems: 'center', 
          backgroundColor: 'rgba(0,0,0,0.6)', 
          color: '#fff',
          padding: '5px', 
          borderRadius: '5px',
          zIndex: 1
        }}
      >
        <Spin tip="Loading" size="small" />
      </div>
    )}
  </div>

  <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
    <Button 
      type="button" 
      color='info' 
      icon={isLoading ? undefined : 'Send'} 
      className='align-self-center'
      onClick={handleSubmit}
      style={{ marginRight: '5px', padding:'5px', marginLeft:'5px' }}
    >
      {isLoading && <Spinner isGrow isSmall/>}
    </Button>

    <Button 
      type="button" 
      color='info' 
      icon= "Mic"
      className='align-self-center'
    >
    </Button>
  </div>
					</InputGroup>




</CardFooter>


                    </Card>
                  </div>
                )}
              </div>
            </Page>
          </Layout>
          

		  );
		  
};

export default WithListYTPage;
