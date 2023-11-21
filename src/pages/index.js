import Navbar from '@/components/navbar.jsx'
import Books from '@/components/Books'
import { useEffect, useState } from "react";
import { getAllBooks } from "@/modules/fetch";
import { Flex, Box } from "@chakra-ui/react";

export default function Home() {
  const [books, setBooks] = useState([]);
  useEffect(() => {
    const fetchBooks = async () => {
      const books = await getAllBooks();
      setBooks(books);
    };
    fetchBooks();
  }, []);
  console.log(books)
  return (
    <>
    <Navbar></Navbar>
    <Flex direction="row" wrap="wrap" justifyContent="center">
      {books?.map((book) => (
          <Books key={`${book.id} ${book.title}`} {...book} />
      ))}
    </Flex>
    </>
  )
}
