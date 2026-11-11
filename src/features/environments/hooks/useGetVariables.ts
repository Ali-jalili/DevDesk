/** @format */

import { useQuery } from "@tanstack/react-query";

import { getVariables } from "@/features/environments/EnvironmentVariableService";

function useGetVariables(environmentId?: string) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["environment_variables", environmentId],

    queryFn: () => getVariables(environmentId!),

    enabled: !!environmentId,
  });

  return {
    data,
    isLoading,
    error,
    refetch,
  };
}

export default useGetVariables;
