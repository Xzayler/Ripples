//@ts-ignore
import defaultPfp from '../../assets/pfps/defaultPfp.svg';

export default function UserPfp(props: { pfp?: string }) {
  return (
    <img
      src={props.pfp ?? defaultPfp}
      alt="default profile picture"
      class=" object-cover rounded-full min-w-full min-h-full"
    />
  );
}
