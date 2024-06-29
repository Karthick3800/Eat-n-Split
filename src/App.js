import { useEffect,useState } from "react";

// import "./index.css"
const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];
function getlocalitems()
{
  let list =localStorage.getItem('friendslist');
  if(list)
    return JSON.parse(list);
  else
    return [];
}
export default function App()
{
  const[showAddfriend,setShowAddFriend]=useState(false);
  const [friends,setFriends]=useState(initialFriends);//getlocalitems()
  const [selectedFriend,setSelectedFriend]=useState(null);
  // const []=useState();
  function handleShowAddFriend()
  {
    setShowAddFriend((show)=>!show);
  }

  // useEffect(()=>{localStorage.setItem('friendslist',JSON.stringify(friends))},[friends]);

  
function handleSplitBill(value)
{
  setFriends(friends=>friends.map(friend=>friend.id===selectedFriend.id?{...friend,balance: friend.balance+value}:friend));
  setSelectedFriend(null);
}

  function handleSelection(friend)
  {
    setSelectedFriend((cur)=>cur?.id===friend.id?null:friend);
    setShowAddFriend(false);
  }



return (
<div className="app">
  <div className="sidebar">
  <FriendsList friends={friends} 
  handleSelection={handleSelection} 
  selectedFriend={selectedFriend}
  />

  {showAddfriend&&<FormAddFriend friends={friends} setFriends={setFriends} handleShowAddFriend={handleShowAddFriend}/>}
  <Button onClick={handleShowAddFriend}>{showAddfriend?"Close":"Add Friend"}</Button>
  </div>
  { selectedFriend && <FormSplitBill friend={selectedFriend} onSplitBill={handleSplitBill} />}
</div>);
}




function FriendsList({friends,handleSelection,selectedFriend})
{
  
  return( 
  <ul>
    {friends.map((friend)=>(
   <Friend friend={friend} key={friend.id}  handleSelection={handleSelection} selectedFriend={selectedFriend} />

  ))}
  </ul>
);
}

function Friend({friend,handleSelection ,selectedFriend})
{
  const isSelected= selectedFriend && selectedFriend.id===friend.id;
  return(<li className={isSelected? `selected`:""}>
    <img src={friend.image} alt={friend.name}/>
    <h3>{friend.name}</h3>
    {friend.balance>0 && 
    (<p className="green">
      {friend.name} owes you  {Math.abs(friend.balance)}₹
      </p>
    )}
    {friend.balance===0 && 
    (<p >You and {friend.name} are even </p>)}

    {friend.balance<0 && (<p className="red">You owe {friend.name} {Math.abs(friend.balance)}₹</p>)}
    <Button onClick={()=>handleSelection(friend)} >{isSelected?"Close":"Select"}</Button>
    </li>
    ) ;
}
function Button({children ,onClick })
{
return <button className="button" onClick={onClick}>{children}</button>
}



function FormAddFriend({setFriends,friends,handleShowAddFriend})
{
  const [name,setName]=useState('');
  const [image,setImage]=useState('https://i.pravatar.cc/48');
  function handleSubmit(e)
  {
e.preventDefault();
if(!name||!image) return ;
const id=crypto.randomUUID();
const newFriend={
  name:name,
  image:`${image}?=${id}`,
  balance:0,
  id,
}
// console.log(newFriend);
setFriends((friends)=>
  [...friends,newFriend]
);
handleShowAddFriend()
setImage("");
setName("");
  }
  return(
     <form className="form-add-friend" onSubmit={handleSubmit}> 
  <label>👦 Friend name</label>
  <input type="text" value={name} onChange={(e)=>setName(e.target.value)}/>
  <label>🌅 Image URL </label>
  <input type="text" value={image} onChange={(e)=>setImage(e.target.value)}/>
  <Button>Add</Button>
  </form>
  );
}
function FormSplitBill({friend,onSplitBill})
{
  const [bill,setBill]=useState("");
  const[paidByUser,setPaidByUser]=useState('');
  const paidByFriend=bill? bill-paidByUser:" ";
  const [whoPay,setWhoPay]=useState('User');

function handeSubmit(e)
{
  e.preventDefault();
  if(!bill || !paidByUser) return ;
    onSplitBill(whoPay==='User' ? paidByFriend: - paidByUser);
  
}
  return (
  <form className="form-split-bill" onSubmit={handeSubmit}>

    <h2>{`Split a bill with ${friend.name} `}</h2>

    <label> 💰Bill value </label>

  <input type="text" value={bill} onChange={(e)=>setBill(Number(e.target.value))}/>

  <label>🧍 Your  expense </label>

  <input type="text" value={paidByUser} onChange={(e)=>setPaidByUser(Number(e.target.value)>bill?paidByUser:Number(e.target.value))}/>

  <label> 👦{`${friend.name}'s`} expense </label>

  <input type="text "value={paidByFriend} disabled/>

  <label> 🤑 Who is paying the bill</label>

  <select value={whoPay} onChange={(e)=>setWhoPay(e.target.value)}>

    <option value="User">You</option>

    <option value='friend'>{friend.name}</option>

  </select>
  <Button>Split bill</Button>
  </form>)
}