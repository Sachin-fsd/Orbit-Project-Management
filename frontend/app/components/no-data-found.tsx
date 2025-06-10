import { CirclePlus } from "lucide-react"
import { Button } from "./ui/button"

interface NoDataFoundProps {
    title: string,
    description: string,
    buttonText: string,
    buttonAction: () => void
}



const NoDataFound = ({
    title,
    description,
    buttonText,
    buttonAction
}: NoDataFoundProps) => {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-3xl font-semibold mb-4">{title}</h1>
            <p className="text-gray-600 mb-6">{description}</p>
            <Button
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
                onClick={buttonAction}
            >
                <CirclePlus className="w-4 h-4 mr-2" />
                {buttonText}
            </Button>
        </div>
    )
}

export default NoDataFound