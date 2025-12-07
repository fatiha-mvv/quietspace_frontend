import Breadcrumb from "../../components/Common/Breadcrumb";
import Feedback from "../../components/Feedback";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Feedback Page",
  description: "This is Feedback Page for QuietSpace",
  // other metadata
};

const FeedbackPage = () => {
  return (
    <>
      <Breadcrumb
        pageName="We Value Your Feedback"
        description="Share your thoughts and help us improve QuietSpace for everyone."
      />
      <Feedback />
    </>
  );
};

export default FeedbackPage;
