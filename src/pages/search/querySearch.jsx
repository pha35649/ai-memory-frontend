import {
  Box,
  Flex,
  List,
  ListItem,
  Loader,
  Paper,
  ScrollArea,
  SimpleGrid,
  Text,
  TextInput,
  Tooltip,
} from "@mantine/core";
import { IconBook, IconSend, IconSwipe } from "@tabler/icons-react";
import { useState } from "react";
import { QuerySearchAPI } from "../../apis/query_searchAPI";

// <span key={index}>
//   {part}
//   <br />
//   <br />
// </span>

export default function QuerySearch() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState({});
  const [loading, setLoading] = useState(false);
  const [showmore, setShowMore] = useState(false);
  const [showsnippet, setShowSnippet] = useState(false);

  const [selectId, setSelectId] = useState(null);

  const processPHAProductionText = (data) => {
    const cleanedText = data.replace(/\n/g, " ");

    const parts = cleanedText.split(/(\[\d+\]\.)/).filter(Boolean);

    const formattedText = [];

    for (let i = 0; i < parts.length; i++) {
      if (!/^\[\d+\]\.$/.test(parts[i])) {
        if (i + 1 < parts.length && /^\[\d+\]\.$/.test(parts[i + 1])) {
          formattedText.push(
            <List.Item key={i} className="mb-[6px]">
              {parts[i].trim()} {parts[i + 1].trim()}
            </List.Item>
          );
          i++;
        } else {
          formattedText.push(<List.Item key={i}>{parts[i].trim()}</List.Item>);
        }
      }
    }

    return <div>{formattedText}</div>;
  };

  const handleSearch = async (query_data) => {
    setQuery(query_data);
    setLoading(true);

    try {
      const response = await QuerySearchAPI(query_data);
      if (response) setResult(response);
      setLoading(false);
    } catch (error) {
      console.error("Error uploading files:", error);
      setLoading(false);
    }
  };

  return (
    <Box h={"100%"} w={"100%"}>
      {Object.keys(result).length === 0 ? (
        <Flex
          h={"100%"}
          w={"100%"}
          justify={"center"}
          align={"center"}
          direction={"column"}
        >
          <Text fz={30} fw={500} mt={"-xl"}>
            Research begins here.
          </Text>
          <TextInput
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch(e.currentTarget.value);
            }}
            mt={"sm"}
            placeholder="Ask anything..."
            w={600}
            rightSection={
              loading ? <Loader size={"sm"} /> : <IconSend size={"1rem"} />
            }
          />
        </Flex>
      ) : (
        // <ScrollArea
        //   offsetScrollbars
        //   p={"lg"}
        //   // style={{ height: "calc(100% - 62px)" }}
        // >
        <div className="p-[28px]">
          <Box>
            <Text size="xl" fw={700}>
              Search Result for
              <span className="ml-3 text-gray-400 italic text-[18px]">
                {query}
              </span>
            </Text>
            <List listStyleType="disc" className="font-custom" pr={"xl"}>
              {processPHAProductionText(result.answer)}
            </List>
            {/* <Flex justify={"end"} mt={"xs"}>
              <Text
                size="sm"
                fw={500}
                fs={"italic"}
                color="blue"
                onClick={() => setShowMore(!showmore)}
                className="hover:cursor-pointer"
              >
                Show {!showmore ? "more" : "less"}
              </Text>
            </Flex> */}
            <Text size="lg" fw={500} mt={"md"}>
              Sources:
            </Text>
            <SimpleGrid cols={{ base: 1, md: 2 }} mt={"xs"}>
              {result.sources &&
                result.sources.length > 0 &&
                result.sources.map((item, index) => {
                  return (
                    <Paper
                      p={"sm"}
                      pr={"xl"}
                      radius={"sm"}
                      shadow="sm"
                      withBorder
                      h={"fit-content"}
                      bg={"#d1d1d1"}
                    >
                      <Flex
                        direction={"column"}
                        justify={"space-between"}
                        h={"100%"}
                      >
                        <Box>
                          <Text
                            fw={500}
                            mb={"sm"}
                            fz={30}
                            color="green"
                            align="center"
                          >
                            [{index + 1}]
                          </Text>
                          <Flex align={"start"} gap={"xs"}>
                            <Tooltip label="Source Title">
                              <div>
                                <IconBook
                                  color="green"
                                  size={"1.3rem"}
                                  className="mt-[2px]"
                                />
                              </div>
                            </Tooltip>
                            <Text fw={500} td="underline">
                              {item.source}
                            </Text>
                          </Flex>
                          <Flex align={"start"} mt={"sm"} gap={"xs"}>
                            <List listStyleType="disc" className="font-custom">
                              {item &&
                                item.text_snippets.map(
                                  (snippets_item, snippets_index) => {
                                    return (
                                      <Box>
                                        {processPHAProductionText(
                                          snippets_item
                                        )}
                                      </Box>
                                    );
                                  }
                                )}
                            </List>
                          </Flex>
                        </Box>
                        <Flex
                          justify={"end"}
                          align={"center"}
                          gap={"xs"}
                          mt={"lg"}
                        >
                          <Text>
                            Pages:{" "}
                            {item.pages.map((pages, pageIndex) => (
                              <span>
                                {pages}
                                {pageIndex === item.pages.length - 1
                                  ? ""
                                  : ", "}
                              </span>
                            ))}
                          </Text>
                        </Flex>
                      </Flex>
                    </Paper>
                  );
                })}
            </SimpleGrid>
          </Box>
        </div>
        // </ScrollArea>
      )}
    </Box>
  );
}
