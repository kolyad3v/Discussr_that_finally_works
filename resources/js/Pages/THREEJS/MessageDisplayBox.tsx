import Card from '@mui/joy/Card'
import CardContent from '@mui/joy/CardContent'
import IconButton from '@mui/joy/IconButton'
import Typography from '@mui/joy/Typography'
import { Reply, Share } from '@mui/icons-material'
import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { PassageType } from '@/types'

import GenericModal from '../GenericModal'
import NewMessageForm from './NewMessageForm'

type MessageDisplayBoxProps = {
	handlePassageClick: (passageId: number) => void
	children: React.ReactNode
	createdAt: string
	passages: PassageType[]
	conversationId: number
	messageId: number
	user: string
}

const MessageDisplayBox: FC<MessageDisplayBoxProps> = ({ children, createdAt, passages, conversationId, messageId, handlePassageClick, user }) => {
	const getTitleSnippetFromChildren = useCallback(() => {
		if (children && typeof children === 'string') {
			const match = children.match(/^(\S+\s){0,4}\S+/)
			return match ? `${match[0]}...` : `${children}...`
		}
	}, [children])

	// console.log(passages, `passages passed in to message display box for message id:${messageId}}`)
	const titleSnippet = getTitleSnippetFromChildren()

	const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
	const handleMouseEnter = (index: number) => {
		setHoveredIndex(index)
	}

	const handleMouseLeave = () => {
		setHoveredIndex(null)
	}

	const highlightedText = useMemo(() => {
		if (typeof children !== 'string') {
			return children
		}

		let lastIndex = 0
		const sortedPassages = [...passages].sort((a, b) => a.start - b.start)
		const segments = []

		sortedPassages.forEach((passage, index) => {
			// Text before the highlighted segment
			if (passage.start > lastIndex) {
				segments.push(
					<Typography
						key={index + passage.length}
						level='body-md'>
						{children.slice(lastIndex, passage.start)}
					</Typography>
				)
			}

			// The highlighted segment
			const highlightedSegment = children.slice(passage.start, passage.start + passage.length)
			segments.push(
				<Typography
					key={index + passage.start}
					level='body-md'
					variant={hoveredIndex === index ? 'soft' : 'plain'}
					onMouseEnter={() => handleMouseEnter(index)}
					onMouseLeave={handleMouseLeave}
					onClick={() => handlePassageClick(passage.id)}
					sx={{ cursor: 'pointer', transition: 'all 0.2s ease-in-out' }}
					color='danger'>
					{highlightedSegment}
				</Typography>
			)

			lastIndex = passage.start + passage.length
		})

		// Add any remaining text after the last passage
		if (lastIndex < children.length) {
			segments.push(children.slice(lastIndex))
		}

		return segments
	}, [children, passages, hoveredIndex])

	const [open, setOpen] = useState<boolean>(false)
	const [passageInfo, setPassageInfo] = useState<{ start: number; length: number } | null>(null)

	const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0 })
	const textRef = useRef(!null)
	const bodyText = useRef(!null)

	// const handleContextMenu = useCallback((event: any) => {
	// 	event.preventDefault()
	// 	const selection = window.getSelection()
	// 	if (selection!.toString().trim() !== '') {
	// 		const start = selection!.anchorOffset
	// 		const length = selection!.toString().length

	// 		setPassageInfo({ start, length })

	// 		setContextMenu({
	// 			visible: true,
	// 			x: event.clientX,
	// 			y: event.clientY,
	// 		})
	// 	}
	// }, [])

	const handleContextMenu = useCallback((event: any) => {
		event.preventDefault()
		const selection = window.getSelection()

		if (selection && selection.rangeCount > 0) {
			const range = selection.getRangeAt(0)
			const container = bodyText.current // Reference to your text container

			if (container && selection.toString().trim() !== '') {
				const combinedText = container.innerText
				const selectedText = selection.toString()

				// Find the actual start position in the combined text
				const start = combinedText.indexOf(selectedText)
				const length = selectedText.length

				if (start !== -1) {
					setPassageInfo({ start, length })
					setContextMenu({
						visible: true,
						x: event.clientX,
						y: event.clientY,
					})
				}
			}
		}
	}, [])

	// console.log(passageInfo, 'message display box')
	useEffect(() => {
		const handleDocumentClick = (event) => {
			// Check if the click is outside the context menu
			if (contextMenu.visible && !textRef.current.contains(event.target)) {
				setContextMenu({ visible: false, x: 0, y: 0 })
			}
		}

		document.addEventListener('click', handleDocumentClick)
		return () => {
			document.removeEventListener('click', handleDocumentClick)
		}
	}, [contextMenu.visible, textRef])

	return (
		<div
			style={{ zIndex: 999 }}
			onContextMenu={handleContextMenu}
			ref={textRef}>
			<Card
				color='primary'
				variant='soft'
				sx={{ width: 640 }}>
				<div>
					<Typography level='title-lg'>{titleSnippet}</Typography>
					<Typography level='body-sm'>
						{createdAt} by {user}
					</Typography>
					<IconButton
						aria-label='share'
						variant='soft'
						color='primary'
						size='lg'
						sx={{ position: 'absolute', top: '0.875rem', right: '0.5rem', transition: 'all 0.2s ease-in-out' }}>
						<Share />
					</IconButton>
				</div>

				<CardContent orientation='horizontal'>
					<Typography
						//@ts-ignore
						ref={bodyText}
						level='body-md'>
						{highlightedText}
					</Typography>
				</CardContent>
			</Card>
			<GenericModal
				width={640}
				height={640}
				open={open}
				setOpen={setOpen}>
				{passageInfo && open && (
					<NewMessageForm
						activeConversationId={conversationId}
						messageId={messageId}
						setOpen={setOpen}
						passageInfo={passageInfo}
					/>
				)}
			</GenericModal>
			{contextMenu.visible && (
				<div style={{ position: 'absolute', top: contextMenu.y - 200, left: Math.abs(contextMenu.x - 500) }}>
					{/* <IconButton
						aria-label='new message'
						variant='soft'
						color='danger'
						sx={{ transition: 'all 0.2s ease-in-out', height: '10rem', width: '10rem', zIndex: 1000 }}
						onClick={() => setOpen(true)}>
						New Message
					</IconButton> */}
					<IconButton
						aria-label='new messages'
						variant='soft'
						color='success'
						onClick={() => {
							setOpen(true)
						}}
						sx={{
							'--IconButton-size': '64px',
							transition: 'all 0.2s ease-in-out',
							zIndex: 1000,
						}}>
						<Reply />
					</IconButton>
				</div>
			)}
		</div>
	)
}
export default MessageDisplayBox
