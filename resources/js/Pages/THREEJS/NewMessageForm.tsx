import Box from '@mui/joy/Box'
import Button from '@mui/joy/Button'
import FormControl from '@mui/joy/FormControl'
import FormLabel from '@mui/joy/FormLabel'
import Textarea from '@mui/joy/Textarea'
import IconButton from '@mui/joy/IconButton'
import FormatBold from '@mui/icons-material/FormatBold'
import FormatItalic from '@mui/icons-material/FormatItalic'
import CircularProgress from '@mui/joy/CircularProgress'

import { useState, useCallback, useEffect } from 'react'
import { useForm } from '@inertiajs/react'
import { toast } from 'react-toastify'

const NewMessageForm = ({
	activeConversationId,
	setOpen,
	messageId,
	passageInfo,
}: {
	activeConversationId: number
	setOpen: any
	messageId: number
	passageInfo: { start: number; length: number } | null
}) => {
	const [italic, setItalic] = useState(false)
	const [bold, setBold] = useState(false)

	// only opens this form if passageInfo is not null
	const form = useForm({
		message: '',
		messageId,
		passageStart: passageInfo!.start,
		passageLength: passageInfo!.length,
	})
	console.log(form, 'form ')
	const submitMessage = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		form.post(route('conversations.messages.store', { conversation: activeConversationId }), {
			onSuccess: () => {
				setOpen(false)
				toast.success('Message submitted successfully!')
				form.reset('message')
			},
			onError: () => {
				toast.error('Something went wrong!')
			},
		})
	}

	return (
		<form
			onSubmit={submitMessage}
			style={{ height: '100%', overflowY: 'scroll' }}>
			<FormControl
				sx={{
					width: 'auto',
					height: '100%',
				}}>
				<FormLabel>Your Message</FormLabel>
				<Textarea
					placeholder='Type something here…'
					minRows={10}
					value={form.data.message}
					onChange={(e) => form.setData('message', e.target.value)}
					endDecorator={
						// @ts-ignore
						<Box
							// @ts-ignore
							sx={{
								display: 'flex',
								gap: 'var(--Textarea-paddingBlock)',
								pt: 'var(--Textarea-paddingBlock)',
								borderTop: '1px solid',
								borderColor: 'divider',
								flex: 'auto',
							}}>
							<IconButton
								variant={bold ? 'soft' : 'plain'}
								color={bold ? 'primary' : 'neutral'}
								aria-pressed={bold}
								onClick={() => setBold((bool) => !bool)}>
								<FormatBold />
							</IconButton>

							<IconButton
								variant={italic ? 'soft' : 'plain'}
								color={italic ? 'primary' : 'neutral'}
								aria-pressed={italic}
								onClick={() => setItalic((bool) => !bool)}>
								<FormatItalic />
							</IconButton>
							<Button
								type='submit'
								variant='soft'
								color='primary'
								disabled={form.processing}
								sx={{ ml: 'auto', transition: 'all 0.2s ease-in-out' }}>
								{form.processing ? (
									<>
										Submitting...
										<CircularProgress size='sm' />
									</>
								) : (
									'Submit'
								)}
							</Button>
						</Box>
					}
					sx={{
						minWidth: 300,
						fontWeight: bold ? 'bold' : 'normal',
						fontStyle: italic ? 'italic' : 'initial',
						height: '100%',
						p: 2,
						overflow: 'visble',
					}}
				/>
			</FormControl>
		</form>
	)
}

export default NewMessageForm
