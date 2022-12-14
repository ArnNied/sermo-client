type TIndexInputProps = {
  id: string
  error?: string
  display: string
  value?: string
  onChangeHandler: (e: string) => void
}

const IndexInput = ({
  id,
  error,
  display,
  value,
  onChangeHandler,
}: TIndexInputProps) => {
  return (
    <div className="flex flex-col space-y-1">
      <label htmlFor={id} className="font-bold">
        {display}
      </label>
      <input
        id={id}
        type="text"
        placeholder={display}
        value={value}
        onChange={(e) => onChangeHandler(e.target.value)}
        className="px-1 py-px border-b-2 border-solid border-primary-base border-opacity-50 focus:border-opacity-100 outline-none"
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  )
}

export default IndexInput
