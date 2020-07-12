import React from "react";
import {
  render,
  fireEvent,
  waitForElementToBeRemoved,
  within,
} from "@testing-library/react";
import App from "./App";
import mockPosts from "./__mocks__/mockPosts.json";

jest.mock("./api");

const weekdays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

test.each(weekdays)(
  "shows table containing correct posts for %s",
  async (weekday) => {
    const { getByText, getByRole, getByLabelText, findAllByRole } = render(
      <App />
    );

    const select = getByLabelText(/Selected weekday/);
    fireEvent.change(select, { target: { value: weekday } });

    await waitForElementToBeRemoved(() => getByText(/Loading/));
    getByRole("table");

    const rows = await findAllByRole("row");
    const day = weekdays.indexOf(weekday);
    const postsForWeekday = mockPosts.filter((post) => post.day === day);

    postsForWeekday.forEach((post, index) => {
      const row = rows[index + 1];
      within(row).getByText(post.author);
      within(row).getByText(post.title);
      within(row).getByText(post.score.toString());
    });
  }
);
