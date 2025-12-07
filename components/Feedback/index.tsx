"use client";

import { useAuth } from "../../app/hooks/useAuth";
import { useState } from "react";
import feedbackService, { FeedbackData } from "../../services/feedback";

const Feedback = () => {
  const { user, isLoading } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isLoading) {
    return <p className="py-10 text-center">Loading...</p>;
  }

  const isLoggedIn = !!user;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const feedbackData: FeedbackData = {
      userId: isLoggedIn ? user.id : null,
      name: isLoggedIn ? user.username : name,
      email: isLoggedIn ? user.email : email,
      message,
    };

    try {
      setIsSubmitting(true);
      const result = await feedbackService.create(feedbackData);

      alert("Merci pour votre feedback !");
      setMessage("");
      if (!isLoggedIn) {
        setName("");
        setEmail("");
      }
    } catch (err) {
      alert("Erreur lors de l'envoi du feedback.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="feedback" className="overflow-hidden py-16 md:py-20 lg:py-28">
      <div className="container">
        <div className="-mx-4 flex flex-wrap justify-center">
          <div className="w-full px-4">
            <div
              className="wow fadeInUp shadow-three dark:bg-gray-dark mb-12 rounded-sm bg-white px-8 py-11 sm:p-[55px] lg:mb-5 lg:px-8 xl:p-[55px]"
              data-wow-delay=".15s"
            >
              <h2 className="mb-3 text-2xl font-bold text-black dark:text-white sm:text-3xl lg:text-2xl xl:text-3xl">
                Share Your Feedback
              </h2>

              <p className="mb-12 text-base font-medium text-body-color">
                Help us improve QuietSpace by sharing your thoughts, ideas, or
                suggestions.
              </p>

              <form onSubmit={handleSubmit}>
                <div className="-mx-4 flex flex-wrap">
                  {!isLoggedIn && (
                    <>
                      <div className="w-full px-4 md:w-1/2">
                        <div className="mb-8">
                          <label className="mb-3 block text-sm font-medium text-dark dark:text-white">
                            Your Name
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="Enter your name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="border-stroke dark:text-body-color-dark dark:shadow-two w-full rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base outline-none focus:border-primary dark:border-transparent dark:bg-[#2C303B]"
                          />
                        </div>
                      </div>

                      <div className="w-full px-4 md:w-1/2">
                        <div className="mb-8">
                          <label className="mb-3 block text-sm font-medium text-dark dark:text-white">
                            Your Email
                          </label>
                          <input
                            type="email"
                            required
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="border-stroke dark:text-body-color-dark dark:shadow-two w-full rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base outline-none focus:border-primary dark:border-transparent dark:bg-[#2C303B]"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {isLoggedIn && (
                    <div className="mb-6 w-full px-4">
                      <div className="rounded-sm bg-gray-100 p-4 text-sm text-body-color dark:bg-[#2C303B]">
                        Sending feedback as:{" "}
                        <span className="font-semibold">{user.username}</span> (
                        <span className="italic">{user.email}</span>)
                      </div>
                    </div>
                  )}

                  <div className="w-full px-4">
                    <div className="mb-8">
                      <label className="mb-3 block text-sm font-medium text-dark dark:text-white">
                        Your Feedback
                      </label>
                      <textarea
                        required
                        rows={5}
                        placeholder="Share your feedback here..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="border-stroke dark:text-body-color-dark dark:shadow-two w-full resize-none rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base outline-none focus:border-primary dark:border-transparent dark:bg-[#2C303B]"
                      ></textarea>
                    </div>
                  </div>

                  <div className="w-full px-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="rounded-sm bg-primary px-9 py-4 text-base font-medium text-white duration-300 hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isSubmitting ? "Sending..." : "Submit Feedback"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Feedback;