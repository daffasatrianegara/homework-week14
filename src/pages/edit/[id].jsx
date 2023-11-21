import { Box } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import BookForm from "@/components/BookForm"
import { getBookDetailById } from "@/modules/fetch";
import { useRouter } from "next/router";

const EditBook = () => {
    const router = useRouter();
    const id = router.query.id 

    const [book, setBook] = useState(null);
    useEffect(() => {
        const fetchBook = async () => {
            try {
                const response = await getBookDetailById(id);
                setBook(response.book);
            } catch(e) {
                console.log(e);
            }
        }
        fetchBook()
    }, [id])
    
    return (
        <Box>
            <BookForm bookData={book} />
        </Box>
    )
    }
export default EditBook