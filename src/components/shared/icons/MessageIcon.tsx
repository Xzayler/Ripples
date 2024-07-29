export default function FaSolidMessage(props: { toFill: boolean }) {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 12 12"
      fill="currentColor"
      fill-opacity={props.toFill ? "1" : "0"}
      stroke="currentColor"
      stroke-width="1"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M4.25 9.75V9.25H3.75H1.5C0.948799 9.25 0.5 8.8012 0.5 8.25V1.5C0.5 0.948799 0.948799 0.5 1.5 0.5H10.5C11.0512 0.5 11.5 0.948799 11.5 1.5V8.25C11.5 8.8012 11.0512 9.25 10.5 9.25H7.24922H7.08252L6.94917 9.35004L4.25 11.375V9.75Z" />
    </svg>

    // <svg
    //   stroke="currentColor"
    //   fill="currentColor"
    //   stroke-width="80"
    //   fill-opacity={props.toFill ? "1" : "0"}
    //   xmlns="http://www.w3.org/2000/svg"
    //   viewBox="0 0 512 512"
    //   style="overflow: visible; color: currentcolor;"
    //   height="100%"
    //   width="100%"
    // >
    //   <path d="M64 0C28.7 0 0 28.7 0 64v288c0 35.3 28.7 64 64 64h96v80c0 6.1 3.4 11.6 8.8 14.3s11.9 2.1 16.8-1.5L309.3 416H448c35.3 0 64-28.7 64-64V64c0-35.3-28.7-64-64-64H64z"></path>
    // </svg>
  );
}
