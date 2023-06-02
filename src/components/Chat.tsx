import React, { FC, HTMLAttributes, ReactNode ,useState, useEffect , useRef} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Avatar from './Avatar';
import useDarkMode from '../hooks/useDarkMode';
import { TColor } from '../type/color-type';
import holderimage from '../assets/img/holder.png'




interface IConversationListItemProps extends HTMLAttributes<HTMLDivElement> {
	id: string;
	className?: string;
	isActive?: boolean;
	title?: string;
}

export const ConversationListItem: FC<IConversationListItemProps> = ({
	id,
	className,
	isActive,
	title,
	...props
}) => {
	const { darkModeStatus } = useDarkMode();

	return (
		<div className={classNames('col-12 cursor-pointer', className)} {...props}>
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
					<div className='d-flex flex-wrap d-xxl-block'>
						<span className='fw-bold fs-5 me-3'>{`Conversation ID: ${id}`}</span>
					</div>
					<div className='text-muted text-truncate'>{title}</div>
				</div>
			</div>
		</div>
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
	to: string;
}
export const ChatHeader: FC<IChatHeaderProps> = ({ to }) => {
	return (
		<>
			<strong className='me-2'>To:</strong>
			{to}
		</>
	);
};
ChatHeader.propTypes = {
	to: PropTypes.string.isRequired,
};

interface IChatMessagesProps extends HTMLAttributes<HTMLDivElement> {
	messages: {
		id?: string | number;
		message?: string | number;
	}[];
	isUser?: boolean;
	isNewConversation?: boolean;
}

export const ChatMessages: FC<IChatMessagesProps> = ({ messages, isUser, isNewConversation, ...props }) => {
	const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
	const [currentMessageText, setCurrentMessageText] = useState('');
  
	const currentMessageTextRef = useRef('');

useEffect(() => {
  if (!isUser && messages[currentMessageIndex]) {
    const message = String(messages[currentMessageIndex].message || '');
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
          setCurrentMessageText('');
        }
      }, 15);
      return () => clearInterval(intervalId);
    } else {
      setCurrentMessageText(message);
      setCurrentMessageIndex((prevIndex) => prevIndex + 1);
    }
  }
}, [messages, currentMessageIndex, isUser, isNewConversation]);

  
	return (
	  <div className='chat-messages' {...props}>
		{isUser
		  ? messages.map((i) => (
			  <div
				key={i.id}
				className={classNames('chat-message', { 'chat-message-reply': isUser })}>
				{i.message}
			  </div>
			))
		  : messages.slice(0, currentMessageIndex).map((i) => (
			  <div
				key={i.id}
				className={classNames('chat-message', { 'chat-message-reply': isUser })}>
				{i.message}
			  </div>
			))}
		{!isUser && isNewConversation && messages[currentMessageIndex] && (
		  <div
			key={messages[currentMessageIndex].id}
			className={classNames('chat-message', { 'chat-message-reply': isUser })}>
			{currentMessageText}
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
		message?: string | number;
	}[];
	color?: TColor | 'link' | 'brand' | 'brand-two' | 'storybook';
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
    const imageSrc = user?.src || holderimage;

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
