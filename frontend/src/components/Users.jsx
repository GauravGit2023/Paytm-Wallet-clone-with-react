import { useEffect, useMemo, useState } from "react"
import { Button } from "./Button";
import axios from "axios";
import { useNavigate } from "react-router-dom";


export function Users (){
    // replace with back end call
    const [users, setUsers] = useState([]);
    const [filter, setFilter] = useState("");

    // add debouncing
    // let debouncedFilter = "";
    // debouncedFilter = useMemo(()=>{
    //     console.log(filter);
    //     let clock1 = null;
    //     clearTimeout(clock1);
    //     clock1 = setTimeout(()=>{
    //         return filter;
    //     },1000);

    // },[filter]);
    // console.log(debouncedFilter);

    useEffect(()=>{
        axios.get("http://localhost:3000/api/v1/user/bulk?filter=" + filter)
        .then(response =>{
            setUsers(response.data.users);
        })
    },[filter])

    return <>
        <div className="text-lg font-bold mt-6">
            Users
        </div>
        <div className="my-2">
            <input onChange={(e)=>{
                setFilter(e.target.value);
            }} className="border border-slate-200 rounded py-1 px-2 w-full" type="text" placeholder="Search users..."></input>
        </div>
        <div>
            {users.map(user =><User user={user}/>)}
        </div>
    </>
}

function User({ user }){
    const navigate = useNavigate();
    return <div className="flex justify-between">
        <div className="flex">
            <div className="flex justify-center bg-slate-200 rounded-full h-12 w-12 mt-1 mr-2">
                <div className="flex flex-col justify-center h-full text-xl">
                    {user.firstName[0]}
                </div>
            </div>
            <div>
                <div className="flex flex-col justify-center h-full">
                    {user.firstName} {user.lastName}
                </div>
            </div>
        </div>
        <div className="flex flex-col justify-center h-full">
            <Button onClick={(e)=>{
                navigate("/send?id=" + user._id + "&name=" + user.firstName);
            }} label={"Send Money"} />
        </div>
    </div>
}