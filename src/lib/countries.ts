import { db } from '~/db'
import { countries } from '~/db/schema'
import { eq } from 'drizzle-orm'

export async function getCountryById({
  countryId,
}: {
  countryId: number | string
}) {
  return await db
    .select()
    .from(countries)
    .where(eq(countries.id, +countryId))
    .then(([country]) => country)
}

export async function getCountryByAlpha3Code({
  alpha3Code,
}: {
  alpha3Code: string
}) {
  return await db
    .select()
    .from(countries)
    .where(eq(countries.alpha3Code, alpha3Code))
    .limit(1)
    .then(([country]) => country)
}
