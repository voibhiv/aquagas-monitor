export interface UseCase<InputDto, OutputDto> {
  execute(input: InputDto): Promise<OutputDto>;
}
