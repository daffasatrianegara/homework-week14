import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Skeleton,
  Image,
  Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { deleteBook, getBookDetailById } from "@/modules/fetch";

function BookDetails() {
  const router = useRouter();
  const [book, setBook] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const getBook = async () => {
      try {
        const response = await getBookDetailById(router.query.id);
        setBook(response.book);
        setLoading(false);
      } catch (e) {
        console.log(e);
      }
    };
    getBook();

    // Check if the user is authenticated and set the state accordingly
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, [router.query.id]);

  const handleDeleteBook = async () => {
    try {
      await deleteBook(router.query.id);
      router.push("/");
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <Flex justifyContent="flex-start" w={"100%"}>
        <Link href="/">
          <Button mt={3} ml={10} colorScheme="red">
            Back
          </Button>
        </Link>
      </Flex>
      <Flex my={6}>
        {book && (
          <Box w={"300px"}>
            <Image alt={book.title} src={book.image} width={300} height={200} />
          </Box>
        )}
      </Flex>
      <Flex my="6">
        <Box w="300px">
          {isLoading ? (
            <Skeleton height="200px" />
          ) : (
            <Box ml="8">
              <Heading as="h1" size="lg">
                {book.title}
              </Heading>
              <Text fontSize="xl" fontWeight="semibold" color="gray.500">
                {book.author}
              </Text>
              <Text fontSize="xl" fontWeight="semibold" color="gray.500">
                {book.publisher}
              </Text>
              <Text fontSize="xl" fontWeight="semibold" color="gray.500" mb="4">
                {book.year} | {book.pages} pages
              </Text>
            </Box>
          )}
        </Box>
      </Flex>
      <HStack>
        {isAuthenticated && (
          <Popover>
            <PopoverTrigger>
              <Button colorScheme="red">Delete</Button>
            </PopoverTrigger>
            <PopoverContent>
              <PopoverArrow />
              <PopoverCloseButton />
              <PopoverHeader>Confirmation!</PopoverHeader>
              <PopoverBody>
                Are you sure you want to delete this book?
              </PopoverBody>
              <Button onClick={handleDeleteBook} colorScheme="red">
                Delete
              </Button>
            </PopoverContent>
          </Popover>
        )}
        {book && isAuthenticated && (
          <Link href={`/edit/${router.query.id}`}>
            <Button>Edit</Button>
          </Link>
        )}
      </HStack>
    </>
  );
}

export default BookDetails;
