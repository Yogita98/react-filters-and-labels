/*
 * HomePage Messages
 *
 * This contains all the text for the HomePage component.
 */
import { defineMessages } from 'react-intl';

export const scope = 'boilerplate.components.Header';

export default defineMessages({
  home: {
    id: `${scope}.home`,
    defaultMessage: 'Home',
  },
  features: {
    id: `${scope}.features`,
    defaultMessage: 'Features',
  },
  part1: {
    id: `${scope}.part1`,
    defaultMessage: 'Part 1',
  },
  part2: {
    id: `${scope}.part2`,
    defaultMessage: 'Part 2',
  },
  startAssignmentHeader: {
    id: `${scope}.start_assignment.header`,
    defaultMessage: 'Reactjs website as part of my Prodigal assesment',
  },
  startAssignmentMessage: {
    id: `${scope}.start_assignment.message`,
    defaultMessage:
      'This is a two-part assignment and the solutions of which can be seen by clicking on respective buttons below!',
  },
});
