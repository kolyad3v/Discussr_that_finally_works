import { FC, memo, useCallback } from 'react'
import { useThree } from '@react-three/fiber'
import { Html, OrbitControls } from '@react-three/drei'
import { IActiveMessage, PassageType } from '../../types/index.js'
import Message from './Message'

import NewFirstMessageButton from './NewFirstMessageButton.js'

const Experience: FC<{ activeMessages: IActiveMessage[]; activeConversationId: number }> = memo(({ activeMessages, activeConversationId }) => {
	// const { raycaster, scene, pointer, viewport } = useThree()

	// const createPassage = useCallback(() => {
	// 	console.log('Clicked')
	// 	console.log(scene)
	// 	console.log(raycaster.intersectObjects(scene.children, true))
	// 	console.log(pointer)
	// 	console.log(viewport)
	// 	let newNode = {
	// 		name: '',
	// 		ref: createRef(),
	// 		color: '#000000',
	// 		position: [pointer.x + (viewport.width / viewport.height) * 3, pointer.y * viewport.height - viewport.width / viewport.height, 0],
	// 	}
	// 	if (confirm('create new message?')) {
	// 		setNodes((prev) => [...prev, newNode])
	// 	}
	// }, [scene, raycaster])

	const explorBranch = (message: IActiveMessage, depth: number) => {
		let finalArray = [
			<Message
				position={[depth * 20, 0, 0]}
				message={message.message}
				createdAt={message.created_at}
				passages={message.passages}
				messageId={message.id}
				conversationId={message.conversation_id}
			/>,
		]

		if (message.passages.length === 0) {
			return
		}
		let nextMessages = getChildren(message.passages)
		// let totalHeightNextGeneration = getTotalHeightOfNextGeneration(nextMessages, 10)
		// let workingYPositionOfNextMessage = totalHeightNextGeneration / 2
		// for (let passage of message.passages) {
		//     let passageMessage = activeMessages.find((message) => message.passage_id === passage.id)
		//     if (passageMessage === undefined) {
		//         continue
		//     }
		//     // godRenderArray.push(createGodObjectFromRawMessage(passageMessage!, [depth * gapXBetweenMessages, workingYPositionOfNextMessage, 0]))
		//     // workingYPositionOfNextMessage -= 5 + gapYBetweenMessages

		// }

		for (let message of nextMessages) {
			// let branch = explorBranch(message, depth + 1)
			// @ts-ignore
			// finalArray = [...finalArray, ...branch]
		}

		return finalArray
	}

	const getChildren = (passages: PassageType[]) => {
		let relatedMessages = passages.map((passage: PassageType) => {
			return activeMessages.find((message) => message.passage_id === passage.id)
		})
		return relatedMessages
	}

	const renderMessages = () => {
		let firstMessage = activeMessages.find((message) => message.passage_id === null)
		return explorBranch(firstMessage!, 0)
	}

	return (
		<>
			<OrbitControls
				enableRotate={false}
				enableZoom={true}
			/>
			<ambientLight intensity={0.5} />

			<mesh>
				<boxGeometry args={[1, 1, 1]} />
				<meshStandardMaterial color='hotpink' />
			</mesh>
			{/* {renderMessages()} */}
		</>
	)
})

export default Experience