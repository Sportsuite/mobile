import DeleteReview from "@/components/Reviews/DeleteReview";
import MakeNewReview from "@/components/Reviews/NewReview";
import CustomActivityIndicator from "@/components/shared/CustomActivityIndicator";
import ToastMsg from "@/components/shared/ToastMsg";
import { GET_REVIEW } from "@/graphql/queries/review.query";
import { useLazyQuery } from "@apollo/client";
import { router } from "expo-router";
import { useSearchParams } from "expo-router/build/hooks";
import React, { useEffect, useState } from "react";

export default function NewReview() {
  const params = useSearchParams();
  const orderId: string = params.get("orderId") || "";
  const [reviewData, setReviewData] = useState<Review>();

  const [GetReview, { loading }] = useLazyQuery(GET_REVIEW, {
    onError: (error) => {
      ToastMsg(error.message, "Get Review Failed");
      router.back();
    },
    onCompleted: ({ GetReview: { data } }) => {
      setReviewData(data);
    },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    if (orderId !== "") {
      GetReview({
        variables: {
          order: orderId,
        },
      });
    }
  }, [orderId]);

  if (loading)
    return (
      <CustomActivityIndicator
        size="large"
        className="flex-1 justify-center items-center"
      />
    );

  return reviewData ? (
    <DeleteReview item={reviewData} />
  ) : (
    <MakeNewReview orderId={orderId} />
  );
}
