import { ParticipantPopulated } from "../../../backend/src/util/types";

export const formatUsernames = (
  participants: Array<ParticipantPopulated>,
  myUserId: string
): string => {
  const usernames = participants
    .filter((participant) => participant.user.id != myUserId)
    .map((participant) => participant.user.username);

  return usernames.join(", ");
};

export function shortenText(
  text: string,
  textLen: number
  ): string {
    if (text.length <= textLen) {
      return text
    }
    return text.substring(0, textLen) + "..."
}