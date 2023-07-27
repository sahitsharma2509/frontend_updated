import React, { FC, HTMLAttributes, ReactNode ,useState, useEffect , useRef} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Avatar from './Avatar';
import useDarkMode from '../hooks/useDarkMode';
import { TColor } from '../type/color-type';
import holderimage from '../assets/img/holder.png';
import Icon from './icon/Icon';
import { CSSProperties } from 'react';
import { animated } from 'react-spring';
import copy from 'copy-to-clipboard';
import Image from 'next/image';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark} from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useContext } from 'react';
import AuthContext from '../contexts/authContext';
import { FilePdfTwoTone,RobotOutlined } from '@ant-design/icons';
import { Components } from 'react-markdown';
import Link from 'next/link';
import Alert from './bootstrap/Alert';
import { AlertHeading } from './bootstrap/Alert';

interface IConversationListItemProps extends HTMLAttributes<HTMLDivElement> {
    id: string;
    className?: string;
    isActive?: boolean;
    title?: string;
    onDelete?: (id: string) => void;
    style?: CSSProperties;
	conversationTitle?: string | null;
}



export const ConversationListItem: FC<IConversationListItemProps> = ({
    id,
    className,
    isActive,
    title,
	conversationTitle,
    onDelete,
    style,  // new style prop
    ...props
}) => {
    const { darkModeStatus } = useDarkMode();

    const [showConfirmDelete, setShowConfirmDelete] = useState(false);

    const handleDeleteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowConfirmDelete(true);
    };

    const handleConfirmDeleteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onDelete) {
            onDelete(id);
        }
    };

    const handleCancelDeleteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowConfirmDelete(false);
    };

    return (
        <animated.div style={style} className={classNames('col-12 cursor-pointer', className)} {...props}>
            <div
                className={classNames(
                    'd-flex align-items-center',
                    'p-3 rounded-2',
                    'transition-base',
                    {
                        'bg-l25-info-hover': !darkModeStatus,
                        'bg-lo50-info-hover': darkModeStatus,
                        'bg-l10-info': !darkModeStatus && isActive,
                        'bg-lo25-info': darkModeStatus && isActive,
                    },
                )}
            >
                <div className='d-grid'>
                    <div className='d-flex flex-wrap d-xxl-block justify-content-between'>
                        <span className='fw-bold fs-6 me-2'>{conversationTitle}</span>
                        {showConfirmDelete ? (
                            <div>
                                <Icon icon="Check" size="lg" onClick={handleConfirmDeleteClick} />
                                <Icon icon="Clear" size="lg" onClick={handleCancelDeleteClick} />
                            </div>
                        ) : (
                            isActive && <Icon icon="Delete" size="lg" onClick={handleDeleteClick} />
                        )}
                    </div>
                    <div className='text-muted text-truncate'>{title}</div>
                </div>
            </div>
        </animated.div>
    );
};



interface IChatAvatarProps extends HTMLAttributes<HTMLDivElement> {
	src?: string;
	srcSet?: string;
	className?: string;
	color?: TColor | 'link' | 'brand' | 'brand-two' | 'storybook';
	isUser?: boolean;
	size?: number;
}
export const ChatAvatar: FC<IChatAvatarProps> = ({
	src,
	srcSet,
	className,
	color,
	isUser,
	size,
	...props
}) => {
	const imageSrc = src || holderimage;
	return (
		<div
			className={classNames('chat-avatar', className)}
			// eslint-disable-next-line react/jsx-props-no-spreading
			{...props}>
			<div className='position-relative'>
				{src && <Avatar srcSet={srcSet} src={imageSrc} size={size} color={color} />}
				{ (
					<span className='position-absolute top-15 start-85 translate-middle badge rounded-pill bg-danger'>
			<span className='visually-hidden'>unread messages</span>
					</span>
				)}
				{isUser && (
					<span className='position-absolute top-85 start-85 translate-middle badge border border-2 border-light rounded-circle bg-success p-2'>
						<span className='visually-hidden'>Online user</span>
					</span>
				)}
			</div>
		</div>
	);
};
ChatAvatar.propTypes = {
	src: PropTypes.string,
	srcSet: PropTypes.string,
	className: PropTypes.string,
	color: PropTypes.oneOf([
		'primary',
		'secondary',
		'success',
		'info',
		'warning',
		'danger',
		'light',
		'dark',
		'link',
		'brand',
		'brand-two',
		'storybook',
	]),
	isUser: PropTypes.bool,
	size: PropTypes.number,
};
ChatAvatar.defaultProps = {
	src: undefined,
	srcSet: undefined,
	className: undefined,
	color: undefined,
	isUser: false,
	size: 45,
};

interface IChatListItemProps extends HTMLAttributes<HTMLDivElement> {
	src: string;
	srcSet?: string;
	className?: string;
	isUser?: boolean;
	color?: TColor | 'link' | 'brand' | 'brand-two' | 'storybook';
	size?: number;
	name: string;
	surname: string;
	latestMessage?: string;
}
export const ChatListItem: FC<IChatListItemProps> = ({
	src,
	srcSet,
	className,
	isUser,
	color,
	size,
	name,
	surname,
	latestMessage,
	...props
}) => {

	const imageSrc = src || holderimage;
	const { darkModeStatus } = useDarkMode();

	return (
		// eslint-disable-next-line react/jsx-props-no-spreading
		<div className={classNames('col-12 cursor-pointer', className)} {...props}>
			<div
				className={classNames(
					'd-flex align-items-center',
					'p-3 rounded-2',
					'transition-base',
					{
						'bg-l25-info-hover': !darkModeStatus,
						'bg-lo50-info-hover': darkModeStatus,


					},
				)}>
				<ChatAvatar
					src={imageSrc}
					srcSet={srcSet}
					isUser={isUser}
					color={color}
					size={size}
					className='me-3'
				/>
				<div className='d-grid'>
					<div className='d-flex flex-wrap d-xxl-block'>
						<span className='fw-bold fs-5 me-3'>{`${name} ${surname}`}</span>
						{(
							<small
								className={classNames(
									'text-info fw-bold px-3 py-1 rounded-pill align-top text-nowrap',
									{
										'bg-l10-info': !darkModeStatus,
										'bg-lo25-info': darkModeStatus,
									},
								)}>

							</small>
						)}
					</div>
					<div className='text-muted text-truncate'>{latestMessage}</div>
				</div>
			</div>
		</div>
	);
};
ChatListItem.propTypes = {
	src: PropTypes.string.isRequired,
	srcSet: PropTypes.string,
	className: PropTypes.string,
	isUser: PropTypes.bool,
	color: PropTypes.oneOf([
		'primary',
		'secondary',
		'success',
		'info',
		'warning',
		'danger',
		'light',
		'dark',
		'link',
		'brand',
		'brand-two',
		'storybook',
	]),
	size: PropTypes.number,
	name: PropTypes.string.isRequired,
	surname: PropTypes.string.isRequired,
	latestMessage: PropTypes.string,
};
ChatListItem.defaultProps = {
	srcSet: undefined,
	className: undefined,
	isUser: false,
	color: 'primary',
	size: 64,
	latestMessage: undefined,
};

interface IChatHeaderProps {
	conversation_title?: string;
	knowledge_base?: string;
  }
  export const ChatHeader: FC<IChatHeaderProps> = ({ conversation_title, knowledge_base }) => {
	return (
		<>
		 <div className ='d-flex title-head '>

			<RobotOutlined style={{ fontSize: '25px', color: '#08c' }} className='justify-content-start' />
						<span className='text-muted' style={{ padding:'5px' }}>
							Jarvis 

						</span>


					
					  <figure className='text-center justify-content-center title-head'>
	<blockquote className='blockquote'>
	<p className='text-center'><strong>{conversation_title}</strong></p>
	</blockquote>
	<figcaption >
	<p className='text-muted text-center'><small>{knowledge_base}</small></p>
	</figcaption>
</figure>
</div>	
		</>
	);
};
ChatHeader.propTypes = {
	conversation_title: PropTypes.string,
	knowledge_base: PropTypes.string
  };

interface IChatMessagesProps extends HTMLAttributes<HTMLDivElement> {
    messages: {
        id?: string | number;
        message?: string;
		isFile?: boolean;
		fileName?: string;
		isAlert?:boolean;
		alert?: JSX.Element;
    }[];
    isUser?: boolean;
    isNewConversation?: boolean;
	
}

export const ChatMessages: FC<IChatMessagesProps> = ({ messages, isUser, isNewConversation, ...props }) => {
    const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
    const [currentMessageText, setCurrentMessageText] = useState('');
    const [copySuccess, setCopySuccess] = useState(false);
    const [showIcons, setShowIcons] = useState(false);
    const currentMessageTextRef = useRef('');

    useEffect(() => {
        if (!isUser && messages[currentMessageIndex]) {
            const message = messages[currentMessageIndex].message || '';
            if (isNewConversation) {
                const intervalId = setInterval(() => {
                    setCurrentMessageText((prevText) => {
                        const newMessageText = prevText + message.charAt(prevText.length);
                        currentMessageTextRef.current = newMessageText;
                        return newMessageText;
                    });
                    if (currentMessageTextRef.current === message) {
						clearInterval(intervalId);
						setCurrentMessageIndex((prevIndex) => prevIndex + 1);
						setCurrentMessageText(message); // replace '' with message
					  }
					  
                }, 15);
                return () => clearInterval(intervalId);
            } else {
                setCurrentMessageText(message);
                setCurrentMessageIndex((prevIndex) => prevIndex + 1);
            }
        }
    }, [messages, currentMessageIndex, isUser, isNewConversation]);

    useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (!isUser && messages[currentMessageIndex]) {
        timeout = setTimeout(() => {
            console.log('Setting showIcons to true');  // Add this line
            setShowIcons(true);
        }, 2000);
    }
    return () => {
        if (timeout) clearTimeout(timeout);
    };
}, [messages, currentMessageIndex, isUser]);


	useEffect(() => {
		let timeoutId: NodeJS.Timeout | number | undefined;
		if (copySuccess) {
			timeoutId = setTimeout(() => {
				setCopySuccess(false);
			}, 2000); // Reset after 2 seconds
		}
		return () => {
			if (timeoutId) {
				clearTimeout(timeoutId as NodeJS.Timeout); // Need to cast it when using clearTimeout
			}
		};
	}, [copySuccess]);

	async function callTextToSpeechAPI(text: string | undefined) {
		if (!text) {
		  console.error('Cannot start Text-to-Speech: text is undefined.');
		  return;
		}
		console.log(`Text: ${text}`);
	  
		try {
		  const res = await axios.post('/api/textToSpeech', { text }, { responseType: 'arraybuffer' });
		  const blob = new Blob([res.data], { type: 'audio/mpeg' });
		  
	  
		  // Create audio element and play
		  const audio = document.createElement('audio');
		  audio.src = URL.createObjectURL(blob);
		  audio.play();
		} catch (error) {
		  console.error('Error in Text-to-Speech API:', error);
		}
	  }


	  const components: Components = {
		code({node, inline, className, children, ...props}) {
			const match = /language-(\w+)/.exec(className || '')
			return !inline && match ? (
				<SyntaxHighlighter 
    style={atomDark as any} 
    language={match[1]} 
    PreTag="div" 
    {...props}>
    {String(children).replace(/\n$/, '')}
</SyntaxHighlighter>

			) : (
				<code className={className} {...props}>
					{children}
				</code>
			)
		}
	};
	
	  
	

	return (
		<div className='chat-messages' {...props}>
  {isUser
    ? messages.map((i) => (
      <div
        key={i.id}
        className={classNames('chat-message', { 'chat-message-reply': isUser })}
      >
        {i.isFile && 
          <div 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              color: '#fff',
              padding: '5px', 
              borderRadius: '5px',
              marginBottom: '10px' // added a margin to separate the file info from the message
            }}
          >
            <FilePdfTwoTone style={{ marginRight: '10px' }} />
            <span>{i.fileName}</span>
          </div>
        }
        {i.message && <ReactMarkdown className='msg'>{i.message}</ReactMarkdown>}
      </div>
    ))
    : messages.slice(0, currentMessageIndex).map((i) => (
      <div
        key={i.id}
        className={classNames('chat-message', { 'chat-message-reply': isUser })}
      >
        {i.isAlert ? 
          <Alert
		    className='your-class-name'
            color= 'danger'
            isLight= {true}
            isOutline= {true}
            borderWidth= {1}
            isDismissible= {false}
            icon= 'PriorityHigh'
            shadow= 'md'
            rounded= 'default'
          >
            <AlertHeading
              tag='h4'
              className='your-heading-class-name'
            >
              {i.message}
            </AlertHeading>
          </Alert>
        :
          <>
            <ReactMarkdown className='msg' components={components}>{currentMessageText || ''}</ReactMarkdown>
            {showIcons && (
              <div className="icon-container">
                {copySuccess ? (
                  <Icon icon="Check" className="icon-copy" size="lg" />
                ) : (
                  <>
                    <Icon
                      icon="ContentCopy"
                      onClick={() => {
                        if (i.message) {
                          copy(i.message);
                          setCopySuccess(true);
                        }
                      }}
                      className="icon-copy"
                    />
                    <Icon 
                      icon="Mic" 
                      className="icon-mic" 
                      size="lg" 
                      color="info" 
                      onClick={() => {
                        callTextToSpeechAPI(i.message);
                      }} 
                    />
                  </>
                )}
              </div>
            )}
          </>
        }
      </div>
    ))}
  {!isUser && isNewConversation && messages[currentMessageIndex] && (
    <div
      key={messages[currentMessageIndex].id}
      className={classNames('chat-message', { 'chat-message-reply': isUser })}
    >
      <ReactMarkdown className='msg' components={components}>{currentMessageText || ''}</ReactMarkdown>

      {showIcons && (
        <div className="icon-container">
          {copySuccess ? (
            <Icon icon="Check" className="icon-copy" size="lg" />
          ) : (
            <>
              <Icon
                icon="ContentCopy"
                onClick={() => {
                  copy(currentMessageText);
                  setCopySuccess(true);
                }}
                className="icon-copy"
              />
              <Icon icon="Mic" className="icon-mic" size="lg" color="danger" />
            </>
          )}
        </div>
      )}
    </div>
  )}
</div>


	  );
};


ChatMessages.propTypes = {
	// @ts-ignore
	messages: PropTypes.arrayOf(
		PropTypes.shape({
			id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
			message: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
		}),
	).isRequired,
	isUser: PropTypes.bool,
};
ChatMessages.defaultProps = {
	isUser: true,
};

interface IChatGroupProps extends HTMLAttributes<HTMLDivElement> {
	isUser?:boolean;
	timestamp?:string;
	isNewConversation?: boolean; 
	messages: {
		id?: string | number;
		message?: string ;
		isFile?: boolean;       // add this line
        fileName?: string;  
		isAlert?: boolean;    // add this line
	}[];
	color?: TColor | 'link' | 'brand' | 'brand-two' | 'storybook';
	src?: string;
	user: {
		src?: string;
		srcSet?: string;
		username?: string;
		name?: string;
		surname?: string;
		color?: TColor | 'link' | 'brand' | 'brand-two' | 'storybook';
	};
}
export const ChatGroup = React.forwardRef<HTMLDivElement, IChatGroupProps>(({
    messages,
    isUser,
    color,
    user,
    isNewConversation,
    ...props
}, ref) => {
    const { userProfileData } = useContext(AuthContext);

    const userAvatar = userProfileData?.avatar;
    const botAvatar = holderimage; // Replace with your actual bot avatar URL

    const imageSrc = isUser ? userAvatar : botAvatar;

    const AVATAR = (
        <ChatAvatar
            src={imageSrc}
            srcSet={imageSrc}
        />
    );

    return (
     <div ref={ref} className={classNames('chat-group', { 'chat-group-reply': isUser })} {...props}>
	{!isUser && user && AVATAR}
	<ChatMessages messages={messages} isUser={isUser} isNewConversation={isNewConversation} />
	{isUser && user && AVATAR}
</div>
    );
});


ChatGroup.propTypes = {
	isUser: PropTypes.bool,
	// @ts-ignore
	messages: PropTypes.arrayOf(
		PropTypes.shape({
			id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
			message: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
		}),
	).isRequired,
	color: PropTypes.oneOf([
		'primary',
		'secondary',
		'success',
		'info',
		'warning',
		'danger',
		'light',
		'dark',
		'link',
		'brand',
		'brand-two',
		'storybook',
	]),
	// @ts-ignore
	user: PropTypes.shape({
		src: PropTypes.string,
		srcSet: PropTypes.string,
		username: PropTypes.string,
		name: PropTypes.string,
		surname: PropTypes.string,
		color: PropTypes.oneOf([
			'primary',
			'secondary',
			'success',
			'info',
			'warning',
			'danger',
			'light',
			'dark',
			'link',
			'brand',
			'brand-two',
			'storybook',
		]),
	}).isRequired,
};
ChatGroup.defaultProps = {
	isUser: true,
	color: undefined,
};

interface IChatProps {
	children: ReactNode;
	className?: string;
}
const Chat: FC<IChatProps> = ({ children, className }) => {
	return (
		// eslint-disable-next-line react/jsx-props-no-spreading
		<div className={classNames('chat-container', className)}>{children}</div>
	);
};
Chat.propTypes = {
	children: PropTypes.node.isRequired,
	className: PropTypes.string,
};
Chat.defaultProps = {
	className: undefined,
};

export default Chat;
