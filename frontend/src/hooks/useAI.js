import { useMutation } from "@tanstack/react-query";
import {
  translateMessage,
  improveMessage,
  friendlyMessage,
  formalMessage,
} from "../lib/api";

export function useAI() {
  const {
    mutateAsync: translate,
    isPending: translating,
  } = useMutation({
    mutationFn: translateMessage,
  });

  const {
    mutateAsync: improve,
    isPending: improving,
  } = useMutation({
    mutationFn: improveMessage,
  });

  const {
    mutateAsync: friendly,
    isPending: makingFriendly,
  } = useMutation({
    mutationFn: friendlyMessage,
  });

  const {
    mutateAsync: formal,
    isPending: makingFormal,
  } = useMutation({
    mutationFn: formalMessage,
  });

  return {
    translate,
    improve,
    friendly,
    formal,

    translating,
    improving,
    makingFriendly,
    makingFormal,
  };
}