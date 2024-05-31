const Item = (props) => {
  const Title = (props) => {
    return <div className="text-zinc-700 text-base font-medium leading-normal">{props.children}</div>
  }

  return <div className="mt-3 first:mt-0 py-3 flex-col justify-start items-start gap-3 inline-flex">
    <Title>{props.title}</Title>
    {props.children}
  </div>
}

export default Item;
