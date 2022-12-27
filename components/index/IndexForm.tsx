import { useRouter } from "next/router"
import { FormEvent } from "react"
import { useState } from "react"
import { TIndexFormErrors } from "~~types/index"

import { updateId as updateChannelId } from "@store/channelSlice"
import { useAppDispatch } from "@store/hooks"
import { updateId as updateUserId, updateUsername } from "@store/userSlice"

import IndexInput from "./IndexInput"

const IndexForm = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()

  const [username, setUsername] = useState("")
  const [channelId, setChannelId] = useState("")
  const [errors, setErrors] = useState<TIndexFormErrors>()

  async function validateForm(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const tempErr: TIndexFormErrors = {}

    if (!username) {
      tempErr.username = "Username is required"
    } else if (username.includes(" ")) {
      tempErr.username = "Username cannot contain spaces"
    } else if (username.length > 16) {
      tempErr.username = "Username cannot be longer than 16 characters"
    }

    if (!channelId) {
      tempErr.channelId = "Channel ID is required"
    } else if (!channelId.match(/^[a-z0-9\-]*$/i)) {
      tempErr.channelId =
        "Channel ID must only contain 'a-Z', '0-9' and '-' characters"
    } else if (channelId.length > 32) {
      tempErr.channelId = "Channel ID must be less than 32 characters"
    }

    if (Object.keys(tempErr).length === 0) {
      const res = await fetch("/api/user/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }),
      }).catch(() => {
        tempErr.misc = "Something went wrong"
      })

      if (res?.status === 201) {
        const req = (await res.json()).content

        const channelRes = await fetch("/api/channel/connect", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + req.id,
          },
          body: JSON.stringify({
            userId: req.id,
            channelId: channelId,
          }),
        }).catch(() => {
          tempErr.misc = "Something went wrong"
        })

        if (channelRes?.status === 200 || channelRes?.status === 201) {
          dispatch(updateUserId(req.id))
          dispatch(updateUsername(username))
          dispatch(updateChannelId(channelId))

          router.push(`/channel/${channelId}`)
        } else {
          tempErr.misc = channelRes?.statusText
        }
      } else {
        tempErr.misc = res?.statusText
      }
    }
    setErrors(tempErr)
  }

  return (
    <div className="w-5/12 h-screen flex flex-col justify-center p-2 md:p-4 lg:p-8 xl:p-16 bg-green-600 space-y-4">
      <div className="flex flex-col">
        <h1 className="font-bold text-6xl text-white text-center">SERMO</h1>
        <h2 className="font-semibold text-white text-center">
          Lightweight and No BS Messaging
        </h2>
      </div>
      <div className="flex mx-8 p-4 bg-white rounded-xl">
        <form
          method="POST"
          onSubmit={(e) => validateForm(e)}
          className="w-full space-y-4"
        >
          <IndexInput
            id="usernameInput"
            error={errors?.username}
            display="Username"
            onChangeHandler={setUsername}
          />
          <IndexInput
            id="channelIdInput"
            error={errors?.channelId}
            display="Channel ID"
            onChangeHandler={setChannelId}
          />
          <div className="flex flex-col space-y-1">
            <button
              type="submit"
              className="p-1 bg-green-600 hover:bg-green-700 active:bg-green-800 text-lg text-white rounded"
            >
              Join/Create Channel
            </button>
            {errors?.misc && (
              <p className="text-sm text-red-600">{errors.misc}</p>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}

export default IndexForm