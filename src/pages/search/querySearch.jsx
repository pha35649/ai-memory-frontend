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

export default function QuerySearch() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState({});
  const [loading, setLoading] = useState(false);
  const [showmore, setShowMore] = useState(false);
  const [showsnippet, setShowSnippet] = useState(false);

  const [selectId, setSelectId] = useState(null);

  const processPHAProductionText = (data) => {
    // const cleanedText = data.replace(/\n/g, " ");
    // const parts = cleanedText.split(/(\[\d+\])/).filter(Boolean);

    // const formattedText = parts.map((part, index) => {
    //   if (/\[\d+\]/.test(part)) {
    //     // If the part is a reference, return the reference followed by a <br /> element
    //     return (
    //       <span key={index}>
    //         {part}
    //         <br />
    //       </span>
    //     );
    //   } else {
    //     // Otherwise, return the text as is
    //     return <span key={index}>{part} </span>;
    //   }
    // });

    // return <div>{formattedText}</div>;
    const cleanedText = data.replace(/\n/g, " ");
    const parts = cleanedText.split(/(\[\d+\]\.)/).filter(Boolean); // Adjusted to split by [1]., [2]., [3].

    const formattedText = parts.map((part, index) => {
      if (/^\[\d+\]\./.test(part)) {
        // If the part is a reference like [1]., [2]., [3].
        return (
          <span key={index}>
            {part}
            <br />
            <br /> {/* Add two <br /> elements */}
          </span>
        );
      } else {
        // Otherwise, return the text as is
        return <span key={index}>{part} </span>;
      }
    });

    return <div>{formattedText}</div>;
  };

  const handleSearch = async (query_data) => {
    setQuery(query_data);
    setLoading(true);

    try {
      const response = await QuerySearchAPI(query_data);
      console.log("=========", response);
      // setResult({
      //   answer: `To maximize PHA production, nitrogen levels should be reduced strategically to create conditions that favor PHA accumulation. The process typically involves two phases: an initial phase where high densities of active biomass are produced under nutrient-rich conditions, followed by a second phase where the limitation of a growth-essential nutrient, such as nitrogen, triggers the production of PHAs as secondary metabolites. This sequential approach is similar to the production processes of other bioproducts like penicillin and citric acid, where the desired bioproducts are generated in response to nutrient limitation [2].\n\nIn practical terms, the reduction of nitrogen should be done in a controlled manner to ensure that the microorganisms switch from growth mode to PHA accumulation mode. This can be achieved by monitoring and adjusting the substrate supply, oxygen input, temperature, and pH-value to maintain optimal conditions for PHA production [2]. \n\nFor example, in a study involving the production of P(3HB) by Bacillus megaterium, an indirect pH-stat feeding regime was used to control the substrate concentration, ensuring it remained in an optimum range for PHA production. This approach resulted in a high PHA content of about 70 wt.% after 72 hours of operation [1].\n\nTherefore, the reduction of nitrogen levels should be done gradually and monitored closely to ensure that the microorganisms are in the optimal state for PHA accumulation. This typically involves transitioning from a nutrient-rich environment to one that is nitrogen-limited, while maintaining other cultivation conditions that support PHA synthesis.\n\n`,
      //   sources: [
      //     {
      //       source:
      //         "Paper BProcess/Processo produttivo/Advances in Polyhydroxyalkanoate (PHA) Production vol 3.pdf",
      //       text_snippets: [
      //         `Conversion of volatile fatty acids (VFAs), obtained by anaerobic transformation of organic residues, by mixed microbial cultures (MMCs) to PHA is another emerging tool to efﬁciently produce PHA from various waste streams [18].`,
      //         `In this setup, a crossflow microﬁltration membrane module was used to recycle active cell biomass (retentate fraction) into the bioreactor... An indirect pH-stat feeding regime... resulted in a high PHA content of about 70 wt.% after 72 h of operation using this setup.`,
      //       ],
      //       pages: [3],
      //     },
      //     {
      //       source:
      //         "Paper BProcess/Materiale PHA/bioengineering PHA 2023 Anindya.pdf",
      //       text_snippets: [
      //         `PHAs are produced by microorganisms in vivo, as an energy source that the organism itself utilizes to survive in nature when it cannot obtain an external carbon source [60].`,
      //         `On an industrial scale, manufacturers use the same natural microorganisms to produce PHAs... PHA production can be compared to plants producing cellulose when they grow.`,
      //       ],
      //       pages: [9, 5],
      //     },
      //   ],
      // });
      if (response) setResult(response);
      setLoading(false);
    } catch (error) {
      console.error("Error uploading files:", error);
      setLoading(false);
    }
  };

  return (
    <Box w={"100%"} h={"100%"}>
      {Object.keys(result).length === 0 ? (
        <Flex h={"100%"} w={"100%"} justify={"center"} align={"center"}>
          <TextInput
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch(e.currentTarget.value);
            }}
            w={600}
            rightSection={
              loading ? <Loader size={"sm"} /> : <IconSend size={"1rem"} />
            }
          />
        </Flex>
      ) : (
        <ScrollArea h={840} offsetScrollbars p={"lg"}>
          <Box>
            <Text size="xl" fw={700}>
              Search Result for
              <span className="ml-3 text-gray-400 italic text-[18px]">
                {query}
              </span>
            </Text>
            <Text size="md" fw={400} lineClamp={!showmore ? 6 : null} mt={"sm"}>
              {processPHAProductionText(result.answer)}
            </Text>
            <Flex justify={"end"} mt={"xs"}>
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
            </Flex>
            <Text size="lg" fw={500} mt={"md"}>
              Sources:
            </Text>
            <SimpleGrid cols={{ base: 1, md: 2 }} mt={"xs"}>
              {result.sources &&
                result.sources.length > 0 &&
                result.sources.map((item, index) => {
                  return (
                    <Paper p={"sm"} radius={"sm"} shadow="sm" withBorder>
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
                            <Tooltip label="Snippets">
                              <div>
                                <IconSwipe color="#228be6" size={"1.3rem"} />
                              </div>
                            </Tooltip>
                            <List type="unordered">
                              {item &&
                                item.text_snippets.map(
                                  (snippets_item, snippets_index) => {
                                    return (
                                      // <Text
                                      //   fw={500}
                                      //   size="sm"
                                      //   mt={"xs"}
                                      //   key={snippets_index}
                                      // >
                                      <Box>
                                        <Text
                                          size="md"
                                          fw={400}
                                          lineClamp={
                                            selectId ===
                                              snippets_index + `${index}` &&
                                            showsnippet
                                              ? null
                                              : 6
                                          }
                                        >
                                          {processPHAProductionText(
                                            snippets_item
                                          )}
                                        </Text>
                                        <Flex justify={"end"} mt={"xs"}>
                                          <Text
                                            size="sm"
                                            fw={500}
                                            fs={"italic"}
                                            color="blue"
                                            onClick={() => {
                                              setSelectId(
                                                snippets_index + `${index}`
                                              );
                                              setShowSnippet(
                                                selectId ===
                                                  snippets_index + `${index}`
                                                  ? !showsnippet
                                                  : true
                                              );
                                            }}
                                            className="hover:cursor-pointer"
                                          >
                                            {selectId ===
                                              snippets_index + `${index}` &&
                                            showsnippet
                                              ? "Show less"
                                              : "Show more"}
                                          </Text>
                                        </Flex>
                                      </Box>
                                      // <ListItem key={snippets_index} mb={"xs"}>
                                      //   {snippets_item}
                                      // </ListItem>
                                      // </Text>
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
        </ScrollArea>
      )}
    </Box>
  );
}
