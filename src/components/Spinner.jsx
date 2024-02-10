import spinner from "../assets/Spinner.svg"

export const Spinner = () => {


    //ragaca 


    
  return (
    <div className="bg-black bg-opacity-50 flex items-center justify-center fixed left-0 right-0 top-0 bottom-0 z-50">
        <div className="">
            <img src={spinner} alt="loading..." className="h-24 " />
        </div>
    </div>
  )
}
