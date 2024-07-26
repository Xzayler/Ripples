export default function(props: {text: string | null, limit: number, color?: string}) {

  return (
    <p
      class={
      `text-${props.text && props.text.length > props.limit ? "red-500" : (props.color ?? "faint")}`
      }
    >{`${props.text?.length ?? 0}/${props.limit}${
      props.text && props.text.length > props.limit ? " Too long" : ""
    }`}</p>
  )
}