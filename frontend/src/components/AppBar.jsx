//grid grid-cols-8 p-3 border-b-2 border-solid border-black-500
export function AppBar(){
    return <div className="shadow h-14 flex justify-between">
        <div className="flex flex-col justify-center h-full text-xl font-bold ml-4">
            ViPay App
        </div>
        <div className="flex">
            <div className="flex flex-col justify-center h-full mr-4">
                Hello, User
            </div>
            <div className="rounded-full h-12 w-12 bg-slate-200 flex justify-center mt-1 mr-2">
                <div className="flex flex-col justify-center h-full text-xl">
                    U
                </div>
            </div>
        </div>
    </div>
}