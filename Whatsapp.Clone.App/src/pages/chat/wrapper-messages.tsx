import styled from "styled-components";
import Box from "@mui/material/Box"; // Certifique-se de importar o Box do Material UI

export const MessagesWrapper = styled(Box)<{ backgroundimage: string }>`
  padding: 1em 0;
  flex-grow: 2;
  overflow-y: auto;
  background-image: url(${(props) => props.backgroundimage});
  background-size: contain;
  background-position: inherit;
  background-repeat: repeat;
`;
