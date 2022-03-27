export default function Userlist(props) {
  return (
    <li id={props.id} className="p-3 hover:bg-blue-600 hover:text-blue-200">
      {props.name}
    </li>
  );
}
